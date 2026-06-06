import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from anthropic import Anthropic
from lib.supabase import supabase
from methods import fetch_data
from datetime import datetime, timedelta
from dotenv import load_dotenv
from methods import workout

load_dotenv()
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
my_id = os.getenv("MY_ID")


def execute_tool(tool_name, tool_input, user_id):
    if tool_name == "fetch_workout_data":
        data = fetch_data.select_weight_data_by_query(
            user_id,
            workout_type=tool_input.get("workout_type"),
            exercise_type=tool_input.get("exercise_type"),
            start_date=tool_input.get("start_date"),
            end_date=tool_input.get("end_date"),
        )
        return compress_workout_data(data)
    return {"error": f"Unknown tool: {tool_name}"}

def compress_workout_data(data):
    grouped = {}

    for workout in data:
        date = workout["date"]
        for exercise in workout.get("Exercises", []):
            name = exercise["exercise_type"]
            sets = exercise.get("Sets", [])

            if name not in grouped:
                grouped[name] = {}
            if date not in grouped[name]:
                grouped[name][date] = []

            for s in sets:
                grouped[name][date].append(f"{s['weight']}x{s['reps']}")

    lines = []
    for ex, dates in grouped.items():
        parts = [f"{d}:{';'.join(sets)}" for d, sets in dates.items()]
        lines.append(f"{ex}|{'|'.join(parts)}")

    return "\n".join(lines)

def call_chatbot(user_id, user_prompt, oldest_date):
    all_workouts = workout.get_all_workouts(fetch_data.get_workout_types(user_id, oldest_date))
    all_exercises = {}
    for name in all_workouts:
        exercises = fetch_data.get_all_exercises_from_a_workout(user_id, name)
        all_exercises[name] = list(exercises)
    
    current_date = fetch_data.get_current_date()
    
    tools = _fetch_tools(all_workouts, all_exercises)
    system_prompt = _fetch_system_prompt(current_date)

    messages = [{"role": "user", "content": user_prompt}]

    response = client.messages.count_tokens(
        model="claude-haiku-4-5-20251001",
        system=system_prompt,
        tools=tools,
        messages=[{"role": "user", "content": user_prompt}]
    )
    print(response.input_tokens)
    #return None

    # Agentic loop
    final_message = _agentic_loop(system_prompt, tools, messages, user_id)
    return final_message

def process_message(user_id, user_prompt):
    oldest_date = fetch_data.get_oldest_date(user_id)
    response = call_chatbot(user_id, user_prompt, oldest_date)

    supabase.table("Messages").insert({
        'user_id': user_id,
        'content': user_prompt,
        'response': response,
    }).execute()

    return response

def _fetch_tools(all_workouts, all_exercises):
    return  [
            {
                "name": "fetch_workout_data",
                "description": "Fetches workout data for a user based on optional filters like workout type, exercise type, and date range.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "workout_type": {
                            "type": "string",
                            "description": "Type of workout, e.g. 'legs' or 'upper'",
                            "enum": all_workouts
                        },
                        "exercise_type": {
                            "type": "string",
                            "description": f"Available exercises by workout type: {all_exercises}. Use workout_type and exercise_type filters accordingly."
                        },
                        "start_date": {
                            "type": "string",
                            "description": "Start date for filtering in YYYY-MM-DD format"
                        },
                        "end_date": {
                            "type": "string",
                            "description": "End date for filtering in YYYY-MM-DD format"
                        }
                    },
                    "required": []
                }
            }
        ]

def _fetch_system_prompt(current_date):
    return f""" You are a fitness coach helping a user analyze their workout data.
                You are having a direct conversation no lists, no astericks, make it flow like a regular conversation
                Your response must be less than 70 words

                When the question requires the user's personal workout history,
                call fetch_workout_data before answering.
                Do not call it for general fitness questions.

                Extract these parameters from the query only if mentioned:
                    - workout_type: e.g.('legs' or 'upper')
                    - exercise_type: specific exercise name (e.g. 'Bench Press', 'Squats')
                    - start_date: in YYYY-MM-DD format
                    - end_date: in YYYY-MM-DD format

                If no date range is mentioned, fetch all available data. 
                If only month and date are given, assume the current date is {current_date}.

                Give at most 2 insightful, specific insights focusing on their prompt and nothing else
            """

def _agentic_loop(system_prompt, tools, messages, user_id):
    while True:
        print(f"\n[API Call] Sending {len(messages)} messages...")
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            system=system_prompt,
            tools=tools,
            messages=messages,
        )
        print(f"[API Response] stop_reason: {response.stop_reason}")

        # Append claude response to message history
        messages.append({"role": "assistant", "content": response.content})

        # If claude is done
        if response.stop_reason == "end_turn":
            final_text = next(
                (block.text for block in response.content if hasattr(block, "text")), ""
            )
            return final_text

        # Handle tool use
        if response.stop_reason == "tool_use":
            tool_results = []

            for block in response.content:
                if block.type == "tool_use":
                    print(f"[Tool Call] {block.name} → {block.input}")
                    result = execute_tool(block.name, block.input, user_id)
                    print(f"[Tool Result] {result}")

                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result
                    })

            # Feed tool results back to claude
            messages.append({"role": "user", "content": tool_results})


if __name__ == '__main__':
    print(call_chatbot(my_id, "how many leg days have i done in the last 45 days", "2025-09-01"))
from anthropic import Anthropic
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from lib.supabase import supabase
from methods import fetch_data
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
my_id = os.getenv("MY_ID")

def call_for_tips(workout_data):
    filtered_data = filter_data(workout_data)
    filtered_data = compress_workout_data(filtered_data)
    prompt = f"""
    
        You are a fitness coach analyzing workout data. 
        Return exactly 3 tips and nothing else.

        Example:
        Progressive overload|Bench flat for 3 weeks|Try dropping to 3x8 instead of 5x5.|Your muscles adapt to the same stimulus over time. Changing rep ranges recruits different muscle fibres and can restart growth without adding more weight.

        Rules:
        - CATEGORY: one of Recovery, Progressive overload, Consistency, Muscle imbalance(compare opposing muscle groups (e.g. hamstrings vs quads, biceps vs triceps, chest vs back)), Habit insight
        - TITLE: the problem, max 6 words
        - BODY: the fix, max 20 words
        - WHY: why it matters, max 50 words
        - Each tip must be supported by the data
        - No duplicate categories(not just label of category but tips should focus on different aspects)
        - No extra text

        Data format: ExerciseName|Date:weightxreps;weightxreps|Date:weightxreps;weightxreps|...
        Data:
        {filtered_data}
        """

    token_count = client.messages.count_tokens(
        model="claude-haiku-4-5-20251001",
        messages=[{"role": "user", "content": prompt}]
    )
    
    print(f"Input tokens: {token_count.input_tokens}")
    print(f"Estimated cost: ${token_count.input_tokens * 0.00000025:.6f}")
    #current output costing ~150 tokens
    #return None

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}]
    )
    formatted_tips = parse_tips_output(response.content[0].text)
    return formatted_tips

def filter_data(workout_data):
    cutoff = datetime.now().date() - timedelta(days=60)
    filtered_data = []
    for row in workout_data:
        row_date = datetime.strptime(row["date"], "%Y-%m-%d").date()
        if row_date > cutoff:
            filtered_data.append(row)
    
    return filtered_data

def compress_workout_data(workout_data):
    grouped = {}

    for row in workout_data:
        exercise = row["exercise_type"]
        date = row["date"]
        weight = row["weight"]
        reps = row["reps"]

        if exercise not in grouped:
            grouped[exercise] = {}

        if date not in grouped[exercise]:
            grouped[exercise][date] = []

        grouped[exercise][date].append(f"{weight}x{reps}")

    # convert to ultra-compact string format
    lines = []
    for ex, dates in grouped.items():
        parts = []
        for d, sets in dates.items():
            parts.append(f"{d}:{';'.join(sets)}")
        lines.append(f"{ex}|{'|'.join(parts)}")

    return "\n".join(lines)

def parse_tips_output(output):
    tips = []
    for line in output.strip().split('\n'):
        if not line.strip():
            continue
        parts = line.split('|')
        if len(parts) != 4:
            continue
        tips.append({
            "category": parts[0].strip(),
            "title": parts[1].strip(),
            "body": parts[2].strip(),
            "reason": parts[3].strip()
        })
    return tips

if __name__ == '__main__':
    print(call_for_tips(fetch_data.get_all_weight_data(my_id)))
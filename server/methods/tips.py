from anthropic import Anthropic
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from lib.supabase import supabase
import fetch_data
from datetime import datetime, timedelta
from dotenv import load_dotenv
from collections import defaultdict

load_dotenv()

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
my_id = os.getenv("MY_ID")

def call_for_tips(workout_data):
    filtered_data = filter_data(workout_data)
    filtered_data = compress_workout_data(filtered_data)
    prompt = f"""
    Give exactly 3 actionable workout tips based on the data.

    Rules:
    - Each tip MUST follow this format:
    Problem: <1 sentence> (max 20 words)
    Fix: <1 sentence> (max 20 words)
    Why: <1 sentence> (can be around 50 words but keep to only needed explanation)
    - Focus on progression, overload, and plateaus
    - You may compare muscle groups if supported by data
    - No extra commentary or additional tips

    Data:
    {filtered_data}
    """
    
    token_count = client.messages.count_tokens(
        model="claude-haiku-4-5-20251001",
        messages=[{"role": "user", "content": prompt}]
    )
    
    print(f"Input tokens: {token_count.input_tokens}")
    print(f"Estimated cost: ${token_count.input_tokens * 0.00000025:.6f}")
    #print(filtered_data)

    '''
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.content[0].text
    '''
    return None

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

print(call_for_tips(fetch_data.get_all_weight_data(my_id)))
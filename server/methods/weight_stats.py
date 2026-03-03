from methods import fetch_data

def get_one_rep_max(data):
    one_rep_max = 0
    for sett in data:
        weight = sett['weight']
        reps = sett['reps']

        denominator = 1.0278 - (0.0278 * reps)
        current = weight/denominator

        one_rep_max = max(one_rep_max, current)

    return round(one_rep_max, 1)
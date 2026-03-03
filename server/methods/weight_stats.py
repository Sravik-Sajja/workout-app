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

def get_total_volume(data):
    total_volume = 0
    for sett in data:
        weight = sett['weight']
        reps = sett['reps']
        total_volume += weight*reps
    
    return total_volume

def get_weight_progression(data):
    result = {}
    for sett in data:
        if sett['date'] in result:
            max_volume_of_that_day = result[sett['date']]
            max_volume_of_current = sett['weight'] * sett['reps']
            result[sett['date']] = max(max_volume_of_that_day, max_volume_of_current)
        else:
            max_volume = sett['weight'] * sett['reps']
            result[sett['date']] = max_volume
    return result
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

def get_max_set_weight_progression(data):
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

def get_average_set_progression(data):
    result = {}
    date_to_number = {}
    for sett in data:
        set_date = sett['date']
        if set_date in result:
            number_of_sets = date_to_number[set_date]
            total_sets_weight = result[set_date] * number_of_sets

            number_of_sets += 1
            date_to_number[set_date]+=1
            
            total_sets_weight += sett['weight'] * sett['reps']
            average_sets_weight = total_sets_weight/number_of_sets
            result[set_date] = average_sets_weight
        else:
            result[set_date] = sett['weight'] * sett['reps']
            date_to_number[set_date] = 1
    return result
            

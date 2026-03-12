from methods import weight_stats

def calculate_weight_stats(weight_data):
    one_rep_max = weight_stats.get_one_rep_max(weight_data)
    total_volume = weight_stats.get_total_volume(weight_data)
    max_set_weight_progression = weight_stats.get_max_set_weight_progression(weight_data)
    average_set_weight_progression = weight_stats.get_average_set_progression(weight_data)

    return {
        'best_one_rep_max': one_rep_max,
        'total_volume': total_volume,
        'max_set_weight_progression': max_set_weight_progression,
        'average_set_weight_progression': average_set_weight_progression
    }
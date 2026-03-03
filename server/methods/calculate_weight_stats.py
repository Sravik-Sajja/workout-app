from methods import weight_stats

def calculate_weight_stats(weight_data):
    one_rep_max = weight_stats.get_one_rep_max(weight_data)

    return {
        'best_one_rep_max': one_rep_max,
    }
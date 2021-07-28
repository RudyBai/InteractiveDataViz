import json

from dateutil.parser import parse as parse_date

REMOVE = {'.', ',', '!', '?', '/', '\\', '+', '-', ':', '(', ')', "\"", "*"}


def save_dict_to_json256(word_list, filename):
    output = open(filename, 'w')
    spliced = sorted(word_list, key=lambda i: i["value"], reverse=True)[0:256]
    json.dump(spliced, output, indent=4)


def save_dict_to_json(dictionary, filename):
    output = open(filename, 'w')
    sort = dict(sorted(dictionary.items(), key=lambda item: item[1], reverse=True))
    json.dump(sort, output, indent=4)


def save_all_words():
    with open('games.json', encoding='utf-8') as games:
        data = json.load(games)
        word_count = dict()

        for game in data:
            for review in (game['reviews']):
                count_word_occurrences_in_review(review, word_count)
        save_dict_to_json(word_count, "total/output.json")


def count_word_occurrences_in_review(review, dictionary):
    raw_text = review['content'].lower()
    for symbol in REMOVE:
        raw_text = raw_text.replace(symbol, ' ')
    words_list = raw_text.split()
    for word in words_list:
        if not word.isalpha():
            words_list.remove(word)
    for word in words_list:
        if word in dictionary:
            dictionary[word] += 1
        else:
            dictionary[word] = 1


def min_max_years():
    with open("games.json", encoding="utf-8") as games:
        data = json.load(games)
        minimum_year = 9999
        maximum_year = 0

        for i in range(0, len(data)):
            try:
                dt = parse_date(data[i]['release_date'])
                if dt.year < minimum_year:
                    minimum_year = dt.year
                if dt.year > maximum_year:
                    maximum_year = dt.year
            except KeyError:
                print("No release date available for " + data[i]["name"])

        print("Min: " + str(minimum_year))
        print("Max: " + str(maximum_year))

        return minimum_year, maximum_year


def words_by_year():
    with open('games.json', encoding='utf-8') as games:
        data = json.load(games)

        word_count_dictionary = dict()
        for game in data:
            try:
                release_date = game['release_date']
                year = parse_date(release_date).year
                if str(year) not in word_count_dictionary:
                    word_count_dictionary[str(year)] = dict()
            except KeyError:
                print("No release date available for " + game["name"])

            for review in game['reviews']:
                count_word_occurrences_in_review(review, word_count_dictionary[str(year)])

        return word_count_dictionary


def save_words_by_year():
    words_by_year_dictionary = words_by_year()
    for year in words_by_year_dictionary:
        filename = "years/" + str(year) + ".json"
        save_dict_to_json(words_by_year_dictionary[year], filename)


def get_years_list():
    with open("games.json", 'r', encoding='utf-8') as file:
        games_dictionary = json.load(file)
        years = []
        for game in games_dictionary:
            try:
                year = parse_date(game['release_date']).year
                if year not in years:
                    years.append(year)
            except KeyError:
                print("No release date available for " + game["name"])
        return years


def save_usage_metric():
    years = get_years_list()
    with open("total/output.json", 'r', encoding='utf-8') as total_json:
        total = json.load(total_json)
        for year in years:
            metric_count_array = []
            with open("years/" + str(year) + ".json", 'r', encoding='utf-8') as words_json:
                words = json.load(words_json)
                for word in words:
                    if word in total:
                        obj = dict()
                        obj["text"] = word
                        obj["value"] = (words[word] / total[word]) * (words[word] ** (1 / 2))
                        obj["count"] = str(words[word]) + "/" + str(total[word])
                        metric_count_array.append(obj)

            save_dict_to_json256(metric_count_array, "metrics/" + str(year) + "_metric.json")


def print_reviews_in_year(year):
    with open("games.json", 'r', encoding='utf-8') as file:
        games_dictionary = json.load(file)
        for game in games_dictionary:
            try:
                # print(parse_date(game['release_date']).year == year)
                if parse_date(game['release_date']).year == year:
                    print(game['reviews'])
            except KeyError:
                print("No release date available for " + game["name"])


if __name__ == '__main__':
    save_all_words()
    save_words_by_year()
    save_usage_metric()
    # print_reviews_in_year(1980)

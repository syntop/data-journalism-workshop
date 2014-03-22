import json
import re
import string

from bs4 import BeautifulSoup
import requests


data = []
stufen = {
    '1': 1000,
    '2': 3500,
    '3': 7000,
    '4': 15000,
    '5': 30000,
    '6': 50000,
    '7': 75000,
    '8': 100000,
    '9': 150000,
    '10': 250000
}


for letter in string.ascii_uppercase:
    url = 'http://www.bundestag.de/bundestag/abgeordnete18/biografien/{0}/index.html'.format(letter)
    r = requests.get(url)
    soup = BeautifulSoup(r.content)
    links = soup.find('ul', class_='standardLinkliste').find_all('a')
    for link in links:
        person = {}
        person['url'] = 'http://www.bundestag.de/bundestag/abgeordnete18/biografien/{0}/{1}'.format(letter, link['href'])
        person['name'], person['fraktion'] = link.text.strip().rsplit(', ', 1)
        person['summe'] = 0

        print person['name'].encode('utf-8')

        r2 = requests.get(person['url'])
        soup2 = BeautifulSoup(r2.content)

        voas = soup2.select('.voa_tab1')
        for voa in voas:
            matches = re.search(r'Stufe (\d+)', voa.text)
            if matches:
                stufe = matches.group(1)
                person['summe'] += stufen[stufe]

        data.append(person)

json.dump(data, open('nebeneinkuenfte.json', 'w'), indent=4)

import json
import os
import re
from time import sleep
import requests


# Request the data file from WikiLeaks server
req = requests.get('http://wlstorage.net/file/scientology-wise-members-2006.txt')
data = req.content

# Fix some typos and inconsistencies
data = data.replace('E-Mail:\n', 'E-Mail: ')
replacements = {
    'Filderstodt': 'Filderstadt',
    'Kirdiheim': 'Kirchheim',
}
for search,replace in replacements.iteritems():
    data = data.replace(search, replace)

# Initialize a variable where we store the sector we're currently going through
sector = None

# Initialize the list where we collect the businesses we are going to find
businesses = []

# Split the whole data into chunks by using a double-linebreak as the separator
chunks = re.split('\n{2,}', data)

# Go through all the chunks
for chunk in chunks:

    # Split the chunk into separate lines
    lines = chunk.split('\n')

    # If the chunk consists of only one line, it is a sector headline.
    if len(lines) == 1:

        # Remember the sector for the coming businesses.
        sector = lines[0]

    # Otherwise it has to be a business listing
    else:

        # Create a new dictionary object for the business, set the sector
        # property, and initialize a list for lines that we cannot identify.
        business = {'sector': sector, '__unidentified__': []}

        # Go through all the lines in the chunke one by one
        for i, line in enumerate(lines):

            # The first line is always the business name. Save that and
            # continue with the next line.
            if i == 0:
                business['name'] = line
                continue

            # If the line starts with 'Tel. ' it's a telephone number
            elif line.startswith('Tel. '):
                business['tel'] = line[5:]

            # Same with fax ...
            elif line.startswith('Fax '):
                business['fax'] = line[4:]

            # ... and e-mail ...
            elif line.startswith('E-Mail: '):
                business['email'] = line[9:]

                # Sometimes the e-mail line also contains a website address.
                # Check if the line contains the string ' www.', and if so
                # split the website from the e-mail address.
                if ' www.' in business['email']:
                    business['email'], business['website'] = business['email'].split(' ', 1)

            # ... and websites
            elif line.startswith('www.'):
                business['website'] = line

            # The country name is always written in capital letters. We are
            # using a regular expression to check if all letters in that line
            # are either a capital letter or a space. If that's the case it has
            # to be the country name.
            elif re.match(r'^[A-Z ]+$', line):
                business['country'] = line

            # All lines that we cannot identify for sure are collected in a
            # '__unidentified__' list.
            else:
                business['__unidentified__'].append(line)

        # The last of the unidentified lines is always the city part of the
        # address. So grab that and save it as the 'city' property.
        business['city'] = business['__unidentified__'].pop(-1)

        # In some cases the country name is on the same line as the city. Split
        # them apart then.
        if not business.has_key('country'):
            business['city'], business['country'] = business['city'].rsplit(', ')

        business.pop('__unidentified__')

        # Append the business to our list of businesses
        businesses.append(business)

# Save the collected businesses in JSON format
with open('scientology-wise-members-2006.json', 'w') as f:
    json.dump(businesses, f, indent=2)

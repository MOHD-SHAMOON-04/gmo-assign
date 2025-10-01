# assignment received on: 
1 Oct, 2025

# so what have i understood so far by watching the video && reading the doc
- basically i have to make a react web-page that has pagination
- instructor bhaiya hai told me to use use datatable component from package => https://primereact.org/datatable/ 
- API to use for data fetching => https://api.artic.edu/api/v1/artworks?page=1 
- use only these fields { title, place_of_origin, artist_display, inscriptions, date_start, date_end }
- see example screenshot, in the doc
- see video for deep explantion, kinda noice explanation

# technical details (must have)
- React app using
  - VITE
  - Typescript
  - use Prime React DataTable component
  - pagination
  - server side pagination: basically fetch the new page from API
  - select row checkbox, also using prime react component
    - one by one or 
    - all at once
  - down icon, just beside "select all checkbox" => overlay pannel again from prime react
  - down icon for kinda custom selection logic, select 'this' number of rows, persit all the selected rows

# check before submitting video (IMP)
- There must not be any variable which is holding all the rows fetched in different pages, else it will lead to out of memory issue.
- On every page change you must call the api to fetch the respective page data irrespective of how many times user visits a page
- Rows selection and deselection must persist across different pages

# Submission:
- Deploy your application on netifly 
Share github repository and deployed url.
Submission must happen within 2 days of receiving assignment

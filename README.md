## My submission
- received on: 1 Oct 2025, 12:24
- submitted on: 2 Oct 2025, 00:20 (roughly)

### Technologies used
- used VITE
- used Typescript
- tried using tailwind, albeit less, moreover tailwind was a requiremnent of Prime React
- used Prime React components, super easy to work

## API usage
- used the specied API https://api.artic.edu/api/v1/artworks with pagination
- used only the required fields: title, place_of_origin, artist_display, inscriptions, date_start, date_end

## check before submitting video guidelines
- yes, I haven't cached any API data on the client side as that would obviously bloat the frontend, everytime we need a new page a fetch call is made that pushed new data to table
- On every page change i am calling the API to fetch the respective page data irrespective of how many times user visits a page
- pagination is working, and the total pages counter is also updated dynamically from the API
- YESS!!, Rows selection and deselection persist across different pages
- added a simple minimal button to clear all selections across all pages
- and yes the default select all button still remains functional but it is used to clear rows only on the current page

## Quick links
- Netlify live demo: [https://gmo-assign-shamoon.netlify.app](https://gmo-assign-shamoon.netlify.app)
- (this->) Github repo: [https://github.com/MOHD-SHAMOON-04/gmo-assign](https://github.com/MOHD-SHAMOON-04/gmo-assign)

## just a sidenote
(PS: copied from internshala chat)
Sir, there's a small issue. I have tested the mock API, and it is not consistent. For example, when we try to retrieve data from, say, page number 2, the first few loads provide consistent data, but over time, the data changes. I have noticed this happening quite often because the id parameter keeps changing.
Since we don't control the server in any way, there's not much we can do about it. Also, because we have no data modification access to that API, we can't use server-side logic to mark or check any data points. We will have to rely solely on client-side logic (which I have implemented), but please be aware that it might become outdated at any time, and all our checkbox data may eventually be lost.

Thanks and Regards
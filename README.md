Anti-Cookies Script Generator
=======

This project generates scripts that are intended to be used in **Tampermonkey** to remove the cookies prompt on the specified website.

To generate a script this project uses the information from the array on `src/data/pagesInfo.js`. The data is an array of objects where each object target a specific website. Each object contain specific data about a website to be targeted by a script. There are some exaples populated on the array as example but none of those objects are requires. You can customize them or remove them as needed and only create the scripts that you require.

### Object format

Property | Type | Description | Default value
---------|------|-------------|--------------
NAME | `String` | Name of the script to be created. It will be appended as a postfix e.g. `anti-cookies-[custom name].js`| `"script"`
WEB_PAGE | `String` | This property will be used in the description of the script for Tampermonkey. It does not impact the script in any way | `"script"`
MATCH | `String` | The match will be used to match the specific web site where the script should run. This follows Tampermonkey's rules. Please refer to its documentation [here](https://www.tampermonkey.net/documentation.php#_match). | `"https://*"`
INCLUDES | `Array<String>` | Similar to `MATCH` this value helps to add pages where the script should run. Please check [here](https://www.tampermonkey.net/documentation.php#_include) for more information. | `[]`
MAX | `Number` | Max number of tries before the script stops. This is useful as many websites do not show a coockies prompt right away. Be mindful about how many retries you need. | `5`
RETRY_TIME | `Number` | Time in seconds between attempts. | `1`
TARGETS | `Array<String>` | CSS selectors that will be used to find the specific html element used for the cookie prompt to be removed. | `[]`
PARENTS | `Array<String>` | CSS selectors for elements that need to be unblocked for navigation. Websites usualy set `overflow: hidden` on these elements to prevent the user from moving on their site. Elements on the parents array will be set to `overflow: auto` | ``[ `html`, `body` ]``

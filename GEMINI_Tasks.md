## Tareas


### JSON files generation

- Given the JSON file format in @www/data/presentations.json, read the content of the @www/gallery/ai_avatars directory and create a new JSON file with the same format, but with the images and videos in the @www/gallery/ai_avatars directory. Each pair of image/video should have a top level entry with the name of the file pair first word before the "_". In the resources array, there'll be one entry for the video referencing the image in the `image` field and the video in the `url` field. The `id` field is a number that starts at 1 and increments by 1 for each entry.

### Page template

- [BAD] I need to have template for the pages of the website, with the same design as the index.html, but with the content of the pages in the @www/data directory. I don't want the The template should be in @www/templates/page.html and used in @www/customer-success.html, @www/imagenes-ia.html, @www/avatares-animados.html, @www/presentaciones.html, @www/prompts-estrategicos.html. The sections to be included in the template from the index.html are: `header`, `contacto`, `footer`. The `main-content` should be a section for each page and all must include the `js/script.js` and the same `<head>` as the index.html.

- I need to implement a template for all website pages. The template is in @www/templates/page.html. I don't want to repeat the template HTML code in each page, instead I want to reference it in each page. Maybe it can be a series of iframe tags in @www/index.html that include each .html file, and show/hide it based on the url, what do you think about it?. The template should be applied to @www/customer-success.html, @www/imagenes-ia.html, @www/avatares-animados.html, @www/presentaciones.html, @www/prompts-estrategicos.html. Each .html file will be the content of the iframes. The iframes should be hidden by default and only the one corresponding to the url should be shown. The iframes should be styled to fill the available space. The iframes should be styled to be transparent. Please plan first, show me the plan, I'll consider it and then you can implement it. The .html files should be filled with the texts for each service that are in the @README.md file. 

### Photos

- Generate an photo realistic image which purpose is to be the main banner of a customer success service in a website. The image should be a photo of a vendor helping a family to decide what to buy. Don't include any text in the image. The image should be in a modern style, with a lot of details and a high resolution. The image should be in a format that can be used in a website, like jpg or png. The image should be in a size of 1920x1080 pixels.

- Generate an photo realistic image which purpose is to be the main banner of a powerpoint and canva presentations development service in a website. The image should be a photo of a person working on a presentation. Don't include any text in the image. The image should be in a modern style, with a lot of details and a high resolution. The image should be in a format that can be used in a website, like jpg or png. The image should be in a size of 1920x1080 pixels.

- Generate an photo realistic image which purpose is to be the main banner of a strategic prompts development service in a website. The image should be a photo of a person working on AI prompts and the AI responding as a robot emerging from the screen. Don't include any text in the image. The image should be in a modern style, with a lot of details and a high resolution. The image should be in a format that can be used in a website, like jpg or png. The image should be in a size of 1920x1080 pixels.

### Gallery JS

Create a JS function in @www/js/galleries.js to show the galleries in the pages.

The JS function will receive a object with the following parameters:

- `jsonFilePath`: JSON file path
- `galleryElementId`: HTML element ID where the gallery will be shown (default "gallery-container")
- `folderColumns`: Number of columns (default 4)
- `folderRows`: Number of rows (default 10)
- `folderMargin`: Margin between galleries (default 10px)
- `thumbnailColumns`: Number of columns (default 4)
- `thumbnailRows`: Number of rows (default 10)
- `thumbnailMargin`: Margin between thumbnails (default 10px)
- `thumbnailSize`: Size of the thumbnail (default 100px)

The JSON file will have this format:

```json
    {
        "id": 1,
        "name": "<Title of the gallery folder>",
        "description": "<Description of the gallery>",
        "category": "<Category of the gallery>",
        "image": "<Path to the thumb image of the gallery>",
        "urls": [
            {
                "name": "<Name of the URL # 1 (can be optional)>",
                "url": "<URL of the item related to the gallery>"
            },
            {
                "name": "<Name of the URL # 2 (can be optional)>",
                "url": "<URL of the item related to the gallery>"
            },
            ...
            {
                "name": "<Name of the URL # N (can be optional)>",
                "url": "<URL of the item related to the gallery>"
            },
        ],
        "resources_type": "image|video|file",
        "resources": [
            {
                "id": 1,
                "name": "<Resource (image, video, file) title>",
                "image": "<URL for the resource image (can be optional)>",
                "url": "<URL for the resource video or file (can be optional) >"
            },
            {
                "id": 2,
                "name": "<Resource (image, video, file) title>",
                "image": "<URL for the resource image (can be optional)>",
                "url": "<URL for the resource video or file (can be optional) >"
            },
            ...
        ]
    },

```

Initially it will show the `gallery folders` as a series of thumbnails in a grid of `folderColumns` columns and `folderRows` rows, with a margin of `folderMargin` between the `gallery folders` and rounded edges.

When the user clicks on the `gallery folder`:
- It will be shown in a lightbox.
- It will have a `name`, `description`, `category`
- It will show the series of URLS from the `urls` array, each on one row.
- It will have a close button to close the lightbox.
- A `gallery` will be shown in a lightbox from the `resources` array.

The `gallery` will show a series of thumbnails in a grid of `thumbnailColumns` columns and `thumbnailRows` rows, with a margin of `thumbnailMargin` between the `gallery` and rounded edges.

Clicking on a thumbnail opens a new tab and depending on the `resources_type` of the `gallery folder`:
- If it is an image, it will open with the image in full screen.
- If it is a video, it will open in a modal with a play button.
- If it is a file, it will open in a new tab.

Each resource will have a `name` as the `alt` attribute of the image, a `image` with the URL of the thumbnail, and optionally a `url` with the URL of the resource that will be opened when the thumbnail is clicked.

If there are more thumbnails than the grid can show, the `gallery` will show a "Show More" button to scroll through the thumbnails with a smooth animation and a observer to detect when the user has reached the end of the `gallery` and show the "Show More" button.

The gallery will have a close button to close the lightbox.

Before starting to implement the gallery, please plan the implementation and show me the plan, I'll consider it and then you can implement it.

## Responive Design for the top Menu

I need the menu options to be in a hamburger menu when it's a mobile device or small display (max-width: 768px and max-width: 480px).

1. When the screen is smaller than 768px:
- The logo must be in the top left corner and the hamburger menu in the top right corner.
- The logo must be smaller so thee top bar height is 60px.
- The menu options must be in a vertical list when the hamburger menu is opened. 

2. When the screen is larger than 768px:
- The menu options must be in a horizontal list.
- The top bar must be shrinked to 60px when the user scrolls down.
- The top bar must be expanded to 100px when the user scrolls to the top.

Before starting to implement the responsive design, please plan the implementation and show me the plan, I'll consider it and then you can implement it.

## Responive Design for the Gallery

I need the gallery folders and the gallery images and videos to be responsive.

1. When the screen is smaller than 768px:
- Show the thumbnails the same way the "main-content" of the @home.html page is shown.
- The same applies to the galley images and videos. Avoid to show in a modal.

2. When the screen is larger than 768px:
- Behave like currently is.

Before starting to implement the responsive design, please plan the implementation and show me the plan, I'll consider it and then you can implement it.






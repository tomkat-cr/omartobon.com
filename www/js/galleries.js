/**
 * Creates a gallery of folders and resources from a JSON file.
 * 
 * @param {object} options - The options for creating the gallery.
 * @param {string} options.jsonFilePath - The path to the JSON file containing the gallery data.
 * @param {string} [options.galleryElementId="gallery-container"] - The ID of the HTML element where the gallery will be shown.
 * @param {number} [options.folderColumns=4] - The number of columns for the gallery folders.
 * @param {string} [options.folderMargin="10px"] - The margin between gallery folders.
 * @param {string} [options.thumbnailMargin="5px"] - The margin between resource thumbnails.
 * @param {boolean} [options.showGalleryThumbNames=true] - Whether to show the resource names in the thumbnails.
 * @param {string} [options.thumbnailSize="200px"] - The size of the resource thumbnails.
 */


// const linkOpenOption = "_blank";
const linkOpenOption = "_self";

export function createGallery(options) {
    const defaults = {
        galleryElementId: "gallery-container",
        folderMargin: "10px",
        thumbnailMargin: "10px",
        showGalleryThumbNames: true,
        thumbnailSize: "200px",
    };

    const config = { ...defaults, ...options };

    if (!config.jsonFilePath) {
        console.error("JSON file path is required.");
        return;
    }

    const galleryContainer = document.getElementById(config.galleryElementId);
    if (!galleryContainer) {
        console.error(`Element with ID "${config.galleryElementId}" not found.`);
        return;
    }

    const folderContainer = document.createElement('div');
    folderContainer.id = 'folder-gallery-container';
    folderContainer.className = 'folder-gallery-container gallery-grid-container';
    // folderContainer.style.display = 'block';
    folderContainer.style.gap = config.folderMargin;
    galleryContainer.appendChild(folderContainer);

    const modalGalleryContainer = document.createElement('div');
    modalGalleryContainer.id = 'modal-gallery-container';
    modalGalleryContainer.className = 'modal-gallery-container';
    modalGalleryContainer.style.display = 'none';
    galleryContainer.appendChild(modalGalleryContainer);
    
    // Fetch data and build the gallery
    fetch(config.jsonFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(galleries => {
            displayGalleryFolders(galleries, folderContainer, config);
        })
        .catch(error => {
            console.error("Error fetching or parsing gallery data:", error);
        });
}

/**
 * Displays the gallery folders in the specified container.
 * @param {Array<object>} galleries - The array of gallery objects.
 * @param {HTMLElement} container - The container element to display the folders in.
 * @param {object} config - The gallery configuration.
 */
function displayGalleryInline(gallery, config) {
    const folderGalleryContainer = document.getElementById('folder-gallery-container');
    const modalGalleryContainer = document.getElementById('modal-gallery-container');

    if (!folderGalleryContainer || !modalGalleryContainer) {
        console.error("Gallery containers not found.");
        return;
    }

    // Hide folders and show inline gallery
    folderGalleryContainer.style.display = 'none';
    modalGalleryContainer.innerHTML = ''; // Clear previous content
    modalGalleryContainer.style.display = 'block';

    // Create a back button
    const backButton = document.createElement('button');
    backButton.className = 'back-to-folders-btn';
    backButton.textContent = '← Back to Galleries';
    backButton.onclick = () => {
        modalGalleryContainer.style.display = 'none';
        folderGalleryContainer.style.display = 'grid'; // Or 'block' depending on original style
    };

    // Create gallery details
    const galleryDetails = document.createElement('div');
    galleryDetails.className = 'gallery-details';
    galleryDetails.innerHTML = `
<div class="gallery-details">
    ${gallery.image ? `<div class="gallery-details-image">
        <img src="${gallery.image}" alt="${gallery.name ?? ''}">` : ''}
    </div>
    <div class="gallery-details-text">
        ${gallery.name ? `<h2>${gallery.name}</h2>` : ''}
        ${gallery.description ? `<p>${gallery.description}</p>` : ''}
        ${gallery.category ? `<p><strong>Category:</strong> ${gallery.category}</p>` : ''}
    </div>
</div>`;

    // Create resources container
    const resourcesContainer = document.createElement('div');
    resourcesContainer.id = 'resources-container';
    resourcesContainer.className = 'resources-container resources-grid-container';

    // Append elements
    modalGalleryContainer.appendChild(backButton);
    modalGalleryContainer.appendChild(galleryDetails);
    modalGalleryContainer.appendChild(resourcesContainer);

    // Display thumbnails
    displayResourceThumbnails(gallery, resourcesContainer, config);
}

function displayGalleryFolders(galleries, container, config) {
    container.innerHTML = ''; // Clear previous content

    galleries.forEach(gallery => {
        const folder = document.createElement('div');
        folder.className = 'gallery-folder';
        folder.style.cursor = 'pointer';
        folder.style.overflow = 'hidden';
        folder.style.textAlign = 'center';

        const img = document.createElement('img');
        img.src = gallery.image || 'assets/images/default-folder.png';
        img.alt = gallery.name;
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.aspectRatio = '1 / 1';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '8px';

        const name = document.createElement('p');
        name.className = 'gallery-folder-name';
        name.textContent = gallery.name;
        name.style.marginTop = '8px';

        folder.appendChild(img);
        folder.appendChild(name);

        folder.addEventListener('click', () => {
            showLightbox(gallery, config);
        });

        container.appendChild(folder);
    });
}

/**
 * Displays the resource thumbnails in the specified container.
 * @param {object} gallery - The gallery object to display.
 * @param {HTMLElement} container - The container element to display the thumbnails in.
 * @param {object} config - The gallery configuration.
 */
function displayResourceThumbnails(gallery, container, config) {
    container.innerHTML = ''; // Clear previous content
    container.style.gap = config.thumbnailMargin;

    const resources = gallery.resources || [];
    if (resources.length === 0) {
        container.innerHTML = '<p>No resources found in this gallery.</p>';
        return;
    }

    let currentIndex = 0;
    const itemsPerPage = 12;
    let showMoreButton;

    const createThumbnail = (resource) => {
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.className = 'resource-thumbnail-container';

        const thumbnail = document.createElement('div');

        thumbnail.className = 'resource-thumbnail';
        thumbnail.style.width = config.thumbnailSize;
        thumbnail.style.height = config.thumbnailSize;
        thumbnail.style.cursor = 'pointer';
        thumbnail.style.overflow = 'hidden';
        thumbnail.style.borderRadius = '8px';

        const img = document.createElement('img');
        img.className = 'resource-thumbnail-image';
        img.src = resource.image || gallery.image;
        img.alt = resource.name;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';

        thumbnail.appendChild(img);

        thumbnailContainer.appendChild(thumbnail);

        if (config.showGalleryThumbNames && resource.name) {
            const name = document.createElement('div');
            name.textContent = resource.name;
            name.className = 'resource-thumbnail-name';
            thumbnailContainer.appendChild(name);
        }

        thumbnail.addEventListener('click', () => {
            handleThumbnailClick(resource, gallery.resources_type);
        });

        return thumbnailContainer;
    };

    const loadMoreResources = () => {
        const fragment = document.createDocumentFragment();
        const nextIndex = currentIndex + itemsPerPage;
        const resourcesToShow = resources.slice(currentIndex, nextIndex);

        resourcesToShow.forEach(resource => {
            fragment.appendChild(createThumbnail(resource));
        });

        container.appendChild(fragment);
        const lastItem = container.lastElementChild;
        currentIndex = nextIndex;

        // Smooth scroll to bring the new items into view
        if (currentIndex > itemsPerPage) {
            lastItem?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }

        // If all resources are loaded, remove the button
        if (currentIndex >= resources.length) {
            showMoreButton?.remove();
        }
    };

    // Add 'Show More' button if needed
    if (resources.length > itemsPerPage) {
        showMoreButton = document.createElement('button');
        showMoreButton.textContent = 'Show More';
        showMoreButton.className = 'show-more-btn';
        showMoreButton.onclick = loadMoreResources;
        // Insert the button after the container, within the lightbox content
        container.parentNode.insertBefore(showMoreButton, container.nextSibling);
    }

    loadMoreResources(); // Load the initial batch of thumbnails
}

/**
 * Handles the click event on a resource thumbnail.
 * @param {object} resource - The resource object.
 * @param {string} resourceType - The type of the resource (image, video, file).
 */
function handleThumbnailClick(resource, resourceType) {
    const url = resource.url || resource.image;
    if (!url) {
        console.warn("No URL found for this resource:", resource.name);
        return;
    }

    switch (resourceType) {
        case 'image':
        case 'video':
        case 'file':
            window.open(url, linkOpenOption);
            break;
        default:
            window.open(url, linkOpenOption);
            break;
    }
}

function showLightbox(gallery, config) {

    const folderGalleryContainer = document.getElementById('folder-gallery-container');
    if (!folderGalleryContainer) {
        console.error(`Element with ID "folder-gallery-container" not found.`);
        return;
    }
    const modalGalleryContainer = document.getElementById('modal-gallery-container');
    if (!modalGalleryContainer) {
        console.error(`Element with ID "modal-gallery-container" not found.`);
        return;
    }

    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.id = 'gallery-lightbox';
    lightbox.className = 'gallery-lightbox';

    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'gallery-lightbox-content';

    const closeButton = document.createElement('span');
    closeButton.className = 'gallery-lightbox-close';
    closeButton.innerHTML = '&times;';

    // closeButton.onclick = () => document.body.removeChild(lightbox);
    closeButton.onclick = () => {
        modalGalleryContainer.style.display = 'none';
        folderGalleryContainer.style.display = 'grid';
    };

    const galleryDetails = document.createElement('div');
    galleryDetails.className = 'gallery-details';
    galleryDetails.innerHTML = `
<div class="gallery-details">
    ${gallery.image ? `<div class="gallery-details-image">
        <img src="${gallery.image}" alt="${gallery.name ?? ''}">` : ''}
    </div>
    <div class="gallery-details-text">
        ${gallery.name ? `<h2>${gallery.name}</h2>` : ''}
        ${gallery.description ? `<p>${gallery.description}</p>` : ''}
        ${gallery.category ? `<p><strong>Category:</strong> ${gallery.category}</p>` : ''}
    </div>
</div>`;

    const urlsList = document.createElement('div');
    urlsList.className = 'gallery-urls';
    if (gallery.urls && gallery.urls.length > 0) {
        gallery.urls.forEach(urlItem => {
            const linkRow = document.createElement('li');
            const link = document.createElement('a');
            link.href = urlItem.url;
            link.textContent = urlItem.name || urlItem.url;
            link.target = '_blank';
            linkRow.appendChild(link);
            urlsList.appendChild(linkRow);
        });
    }

    const resourcesContainer = document.createElement('div');
    resourcesContainer.id = 'resources-container';
    resourcesContainer.className = 'resources-container';

    // Append elements
    lightboxContent.appendChild(closeButton);
    lightboxContent.appendChild(galleryDetails);
    if (gallery.urls && gallery.urls.length > 0) {
        lightboxContent.appendChild(urlsList);
    }
    lightboxContent.appendChild(resourcesContainer);
    lightbox.appendChild(lightboxContent);

    folderGalleryContainer.style.display = 'none';

    // Empty the content container
    modalGalleryContainer.innerHTML = '';
    modalGalleryContainer.style.display = 'block';
    modalGalleryContainer.appendChild(lightbox);

    displayResourceThumbnails(gallery, resourcesContainer, config);
}

/* eslint-disable linebreak-style */
/**
 * Handle responsive layout adjustments for the block.
 * Adds/removes 'mobile-layout' when the block's width is below a threshold.
 */
function handleResponsiveLayout(block) {
    if (typeof ResizeObserver === 'undefined') return;

    const resizeObserver = new ResizeObserver(() => {
        if (block.offsetWidth < 480) {
            block.classList.add('mobile-layout');
        } else {
            block.classList.remove('mobile-layout');
        }
    });

    resizeObserver.observe(block);
}

/**
 * Add scroll-based animations to the block using IntersectionObserver.
 */
function addScrollAnimations(block) {
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    // Optionally stop observing after animation has triggered
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2, rootMargin: '0px 0px -50px 0px' },
    );

    observer.observe(block);
}

/**
 * Enhanced Quote Block Implementation
 * Supports multiple style variants and accessibility features
 */
export default function decorate(block) {
    if (!block) return;

    // Expecting the block to have up to three children:
    // [quoteWrapper, authorWrapper, authorTitleWrapper]
    const [quoteWrapper, authorWrapper, authorTitleWrapper] = Array.from(block.children || []);

    // Create semantic HTML structure
    const blockquote = document.createElement('blockquote');
    const footer = document.createElement('footer');

    // Populate quote content (fall back to empty string if missing)
    blockquote.innerHTML = quoteWrapper ? quoteWrapper.innerHTML : '';
    blockquote.setAttribute('role', 'presentation');

    // Create author citation
    const cite = document.createElement('cite');
    const authorText = authorWrapper ? authorWrapper.textContent.trim() : '';
    if (authorText) cite.textContent = authorText;

    // Add author title if provided
    if (
        authorTitleWrapper
        && authorTitleWrapper.textContent
        && authorTitleWrapper.textContent.trim()
    ) {
        const authorTitle = document.createElement('span');
        authorTitle.className = 'author-title';
        authorTitle.textContent = authorTitleWrapper.textContent.trim();

        // Insert a line break then the title inside the cite
        cite.appendChild(document.createElement('br'));
        cite.appendChild(authorTitle);
    }

    if (cite.childNodes.length > 0) footer.appendChild(cite);

    // Clear original block content and append semantic structure
    block.innerHTML = '';
    block.appendChild(blockquote);
    block.appendChild(footer);

    // Accessibility attributes
    block.setAttribute('role', 'figure');
    block.setAttribute('aria-label', 'Quote');

    // Responsive behaviour and animations
    handleResponsiveLayout(block);
    addScrollAnimations(block);
}

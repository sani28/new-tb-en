document.addEventListener('DOMContentLoaded', function() {
    const descriptions = document.querySelectorAll('.description');

    const DESCRIPTION_CHAR_LIMIT = 150;

    function truncateToCharLimit(str, charLimit) {
        const clean = (str || '').trim();
        if (!clean) return '';
        if (clean.length <= charLimit) return clean;
        return clean.slice(0, charLimit).trimEnd() + '...';
    }

    descriptions.forEach((description) => {
        const textEl = description.querySelector('.description-text');
        if (!textEl) return;

        const fullText = (textEl.textContent || '').trim();
        if (!fullText) return;

        if (fullText.length <= DESCRIPTION_CHAR_LIMIT) return;

        // Create Read more/less toggle
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'view-all-btn visible';
        toggleBtn.type = 'button';
        toggleBtn.textContent = 'Read more';
        toggleBtn.setAttribute('aria-expanded', 'false');

        // Store full text so we can restore it
        textEl.dataset.fullText = fullText;
        textEl.textContent = truncateToCharLimit(fullText, DESCRIPTION_CHAR_LIMIT);

        let isExpanded = false;
        toggleBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            toggleBtn.setAttribute('aria-expanded', String(isExpanded));
            toggleBtn.textContent = isExpanded ? 'Read less' : 'Read more';
            textEl.textContent = isExpanded
                ? (textEl.dataset.fullText || fullText)
                : truncateToCharLimit((textEl.dataset.fullText || fullText), DESCRIPTION_CHAR_LIMIT);
        });

        description.appendChild(toggleBtn);
    });

    // Handle tab navigation
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(tabId) {
        // Remove active class from all tabs and contents
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        // Add active class to selected tab and content
        const selectedButton = document.querySelector(`[data-tab="${tabId}"]`);
        const selectedContent = document.getElementById(`${tabId}-tab`);

        if (selectedButton && selectedContent) {
            selectedButton.classList.add('active');
            selectedContent.classList.add('active');
            
            // Save the active tab to sessionStorage
            sessionStorage.setItem('activeDiscountTab', tabId);
        }
    }

    // Add click event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = button.getAttribute('data-tab');
            if (tabId) {
                switchTab(tabId);
            }
        });
    });

	    // If we deep-linked to an affiliate modal, force the Affiliate tab so the
	    // UI matches the modal content (and overrides any saved tab).
	    const affiliateParam = new URLSearchParams(window.location.search).get('affiliate');
	    if (affiliateParam) {
	        switchTab('affiliate');
	    } else {
	        // Check if there is a saved tab in sessionStorage
	        const savedTab = sessionStorage.getItem('activeDiscountTab');
	        if (savedTab) {
	            switchTab(savedTab);
	        } else {
	            // Initialize first tab
	            const firstTab = tabButtons[0];
	            if (firstTab) {
	                const firstTabId = firstTab.getAttribute('data-tab');
	                if (firstTabId) {
	                    switchTab(firstTabId);
	                }
	            }
	        }
	    }

    // Form submission handlers
    const partnerForm = document.getElementById('partner-application-form');
    if (partnerForm) {
        partnerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Here you would normally send the form data to your server
            // For this example, we'll just show a success message
            alert('Thank you for your application! We will contact you soon.');
            partnerForm.reset();
        });
    }

    const recommendForm = document.getElementById('recommend-form');
    if (recommendForm) {
        recommendForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Here you would normally send the form data to your server
            // For this example, we'll just show a success message
            alert('Thank you for your recommendation! If we partner with this business, we will notify you with a special discount.');
            recommendForm.reset();
        });
    }
}); 
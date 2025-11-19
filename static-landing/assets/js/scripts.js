// RouteIQ Website JavaScript

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
	initializeEventListeners();
	initializeAnimations();
	initializeMobileMenu();
});

// Initialize Event Listeners
function initializeEventListeners() {
	// Demo booking buttons
	const demoButtons = document.querySelectorAll('button');
	demoButtons.forEach(button => {
		if (button.textContent.includes('Demo') || button.textContent.includes('Trial')) {
			button.addEventListener('click', handleDemoBooking);
		}
	});

	// Smooth scrolling for navigation links
	const navLinks = document.querySelectorAll('nav a[href^="#"]');
	navLinks.forEach(link => {
		link.addEventListener('click', handleSmoothScroll);
	});

	// Form submissions (for future contact forms)
	const forms = document.querySelectorAll('form');
	forms.forEach(form => {
		form.addEventListener('submit', handleFormSubmission);
	});
}

// Demo Booking Handler
function handleDemoBooking(event) {
	event.preventDefault();
	
	// In production, this would integrate with a booking system like Calendly
	const isDemo = event.target.textContent.includes('Demo');
	const isTrial = event.target.textContent.includes('Trial');
	
	if (isDemo) {
		showBookingModal('demo');
	} else if (isTrial) {
		showBookingModal('trial');
	}
	
	// Analytics tracking (placeholder)
	trackEvent('button_click', {
		button_type: isDemo ? 'demo' : 'trial',
		section: getCurrentSection(event.target)
	});
}

// Smooth Scrolling Handler
function handleSmoothScroll(event) {
	event.preventDefault();
	
	const targetId = event.target.getAttribute('href');
	const targetElement = document.querySelector(targetId);
	
	if (targetElement) {
		targetElement.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
	}
}

// Form Submission Handler
function handleFormSubmission(event) {
	event.preventDefault();
	
	const formData = new FormData(event.target);
	const formType = event.target.dataset.formType || 'contact';
	
	// Validation
	if (!validateForm(formData, formType)) {
		return;
	}
	
	// Submit form (placeholder for actual implementation)
	submitForm(formData, formType);
}

// Show Booking Modal
function showBookingModal(type) {
	// Create modal overlay
	const overlay = document.createElement('div');
	overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
	
	// Create modal content
	const modal = document.createElement('div');
	modal.className = 'bg-white rounded-xl p-8 max-w-md w-full';
	
	const title = type === 'demo' ? 'Book Free Demo' : 'Start Free Trial';
	const description = type === 'demo' 
		? 'Schedule a personalized demo with our team to see how RouteIQ can optimize your running routes.'
		: 'Get instant access to RouteIQ Pro features with our 14-day free trial.';
	
	modal.innerHTML = `
		<div class="text-center">
			<h3 class="text-2xl font-bold text-brand-dark mb-4">${title}</h3>
			<p class="text-gray-600 mb-6">${description}</p>
			<div class="space-y-4">
				<button onclick="window.open('https://calendly.com/routeiq-demo', '_blank')" 
						class="w-full bg-brand-red text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
					${type === 'demo' ? 'Schedule Demo' : 'Start Trial'}
				</button>
				<button onclick="closeModal()" 
						class="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:border-brand-red hover:text-brand-red transition-colors">
					Maybe Later
				</button>
			</div>
		</div>
	`;
	
	overlay.appendChild(modal);
	document.body.appendChild(overlay);
	
	// Close modal on overlay click
	overlay.addEventListener('click', function(e) {
		if (e.target === overlay) {
			closeModal();
		}
	});
}

// Close Modal
function closeModal() {
	const modal = document.querySelector('.fixed.inset-0');
	if (modal) {
		modal.remove();
	}
}

// Initialize Animations
function initializeAnimations() {
	// Intersection Observer for scroll animations
	const observerOptions = {
		threshold: 0.1,
		rootMargin: '0px 0px -50px 0px'
	};
	
	const observer = new IntersectionObserver(function(entries) {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('animate-fade-in');
			}
		});
	}, observerOptions);
	
	// Observe sections for animation
	const sections = document.querySelectorAll('section');
	sections.forEach(section => {
		observer.observe(section);
	});
}

// Initialize Mobile Menu (for future mobile navigation)
function initializeMobileMenu() {
	const mobileMenuButton = document.querySelector('[data-mobile-menu]');
	const mobileMenu = document.querySelector('[data-mobile-menu-content]');
	
	if (mobileMenuButton && mobileMenu) {
		mobileMenuButton.addEventListener('click', function() {
			mobileMenu.classList.toggle('hidden');
		});
	}
}

// Utility Functions
function getCurrentSection(element) {
	const section = element.closest('section');
	return section ? section.id || section.className : 'unknown';
}

function validateForm(formData, formType) {
	// Basic validation - extend as needed
	const email = formData.get('email');
	const name = formData.get('name');
	
	if (!email || !isValidEmail(email)) {
		showNotification('Please enter a valid email address', 'error');
		return false;
	}
	
	if (!name || name.trim().length < 2) {
		showNotification('Please enter your name', 'error');
		return false;
	}
	
	return true;
}

function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

function submitForm(formData, formType) {
	// Placeholder for form submission
	console.log('Submitting form:', formType, formData);
	
	// Show success message
	showNotification('Thank you! We\'ll be in touch soon.', 'success');
}

function showNotification(message, type = 'info') {
	const notification = document.createElement('div');
	notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg text-white ${
		type === 'success' ? 'bg-green-500' : 
		type === 'error' ? 'bg-red-500' : 
		'bg-blue-500'
	}`;
	notification.textContent = message;
	
	document.body.appendChild(notification);
	
	setTimeout(() => {
		notification.remove();
	}, 5000);
}

function trackEvent(eventName, properties = {}) {
	// Placeholder for analytics tracking
	console.log('Analytics Event:', eventName, properties);
	
	// In production, integrate with analytics service:
	// gtag('event', eventName, properties);
	// or mixpanel.track(eventName, properties);
}

// Performance and SEO Optimizations
function optimizeImages() {
	// Lazy loading for images (when added)
	const images = document.querySelectorAll('img[data-src]');
	
	const imageObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const img = entry.target;
				img.src = img.dataset.src;
				img.classList.remove('lazy');
				observer.unobserve(img);
			}
		});
	});
	
	images.forEach(img => imageObserver.observe(img));
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizeImages);

// Export functions for potential use in other modules
window.RouteIQ = {
	handleDemoBooking,
	showBookingModal,
	closeModal,
	trackEvent,
	showNotification
};
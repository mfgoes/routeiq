// Tailwind CSS Configuration for RouteIQ
tailwind.config = {
	theme: {
		extend: {
			colors: {
				brand: {
					red: '#B91C1C',
					dark: '#374151'
				}
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif']
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem'
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'slide-up': 'slideUp 0.6s ease-out',
				'bounce-subtle': 'bounceSubtle 2s infinite'
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				slideUp: {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				bounceSubtle: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				}
			},
			boxShadow: {
				'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.1)',
				'brand': '0 4px 20px 0 rgba(185, 28, 28, 0.2)'
			}
		}
	},
	plugins: []
};
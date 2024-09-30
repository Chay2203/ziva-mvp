module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",
  "./pages/**/*.{js,jsx,ts,tsx}"
],  
  theme: {
    extend: {
      fontFamily: {
        helvetica: ['"Helvetica Now"', 'sans-serif'],
      },
      letterSpacing: {
        'extra-tight': '-0.09em',
        'little-tight': '-0.05em',
      },
      lineHeight: {
        tight: '1.1',
      },
    },
  },
  plugins: [],
};

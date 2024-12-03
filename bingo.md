# Bingo in the DOM

Port your bingo game to the DOM. Here are some steps to follow:

1. Create an `index.html` file.
1. Connect a CSS file & the bingo implementation you wrote to it.
1. in the HTML file, create 2 html tables - one for each of the two players.
1. Add in some fake hard coded data to one of them and give it some basic .styling. 
    - Give fixed sizes to the table cells using the  `width` & `height` CSS properties.
    - Change the font family & size using `font-family` & `font-size`.
    - Center the tables with `margin: auto;`.
1. Update the code to render the bingo boards dynamically to the HTML tables.
1. Add a **Start** button which will start the game .
1. When clicked, update the button text to **Pause** / **Resume** and implement the relevant functionality.
1. Display the called number in big text on the top of the page.
1. When a called number is found on the board, highlight its cell with a red background color for 1 second and then give it a different color to indicate that it has been marked.
1. Display the name & achivment of the winner at the top of the page.
1. Give the table of the winner a red border.
1. Can you make the game support any number of players? What would it require?
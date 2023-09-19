// describe("Actions in the home page", ()=>{
//     it('Should visit the home page', ()=>{
//         cy.visit('/homeApp.html')
//     })
// })
describe('Fetch and Display Posts', () => {
    it('Should fetch and display posts with user information', () => {
      // Stub network requests for posts and user information using cy.route or cy.intercept
  
      // Visit the page where posts are displayed (e.g., /homeApp.html)
      cy.visit('/homeApp.html');
  
      // Ensure that the page has loaded correctly
      cy.get('body').should('have.class', 'loaded');
  
      // Simulate the API request to fetch posts using cy.route or cy.intercept
      cy.intercept('GET', 'http://localhost:5000/posts/allPosts', {
        fixture: 'posts.json', // Provide a fixture containing sample posts data
      }).as('fetchPosts');
  
      // Trigger the code that fetches and displays posts (e.g., by calling a function)
      // You can trigger it by clicking a button, for example
      cy.get('.fetch-posts-button').click(); // Replace with the actual selector
  
      // Wait for the API request to complete
      cy.wait('@fetchPosts').then((xhr) => {
        // Assert that the request was successful (status code 200)
        expect(xhr.response.statusCode).to.equal(200);
  
        // Assert that the posts are displayed on the page
        cy.get('.post').should('have.length.gt', 0);
  
        // Iterate through each displayed post and perform assertions
        cy.get('.post').each(($post, index) => {
          // Assertions for post content, user information, and interactions
          cy.wrap($post)
            .find('.postContent')
            .should('contain.text', 'Post Name'); // Replace with the expected post content
  
          // Add more assertions for user information, comments, likes, etc.
  
          // Simulate clicking the "like" button on the post (if needed)
          cy.wrap($post).find('.numLikes').click(); // Replace with the actual selector
          // Add assertions to verify that the post is liked
  
          // Simulate clicking the "comment" link (if needed)
          cy.wrap($post).find('.commentLink').click(); // Replace with the actual selector
          // Add assertions to verify that the comments page is opened
  
          // You can continue with more interactions and assertions as needed
        });
      });
    });
  });
  
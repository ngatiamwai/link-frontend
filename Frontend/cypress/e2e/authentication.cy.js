describe('Authentication Forms', () => {
    it("Should navigate to register",() =>{
        cy.visit('/register.html'); 

        const name = 'Ngatia Mwai';
        const userName = "mwai"
        const email = 'mwai@gmail.com';
        const phoneNumber = '1234567890';
        const password = '123456789';


        cy.get('.name').type(name);
        cy.get('.userName').type(userName);
        cy.get('.email').type(email)
        cy.get('.phoneNumber').type(phoneNumber);
        cy.get('.password').type(password);

        cy.get('.submit').click();

        cy.url().should('include', '/register.html');
    })


    it('should redirect to the login page when "Log in" link is clicked', () => {
        cy.visit('/register.html');
    
        cy.contains('Log in').click();
    
        cy.url().should('include', '/login.html');
    });

    it('Should Log in a user', ()=>{
        cy.visit('/login.html')

        const email = "mwai@gmail.com"
        const password = "123456789"

        

        cy.get('.email').type(email)
        cy.get('.password').type(password)

        cy.get('.submit').click()

        cy.url('include', '/homeApp.html')
    })
    
    it('should redirect to the Forgot Password page when "Forgot Pasword" link is clicked', () => {
        cy.visit('/login.html');
    
        cy.contains('Forgot Pasword').click();
    
        cy.url().should('include', '/forgotPassword.html');
    });

    it('should allow the email being input by the user', ()=>{
        cy.visit('/forgotPassword.html')

        const email = "mwaingatia25@gmail.com"

        cy.get('.enterEmail').type(email)

        cy.contains('Submit').click();
    
    })

    it('Should allow the input of the token and password sent to the user', ()=>{
        cy.visit('/newForgotPassword.html')

        const enterToken = "1f2d4811-6996-487b-aadc-49ed3adc0351"
        const enterPassword = "1234567890qwertyuiop"

        cy.get('.enterToken').type(enterToken)
        cy.get('.enterPassword').type(enterPassword)

        cy.contains('Submit').click()
    })
    

    it('Should Log in and like a post', () => {
        cy.visit('/login.html');
      
        const email = "mwaingatia25@gmail.com";
        const password = "1234567890qwertyuiop";
      
        cy.get('.email').type(email);
        cy.get('.password').type(password);
      
        cy.get('.submit').click();
      
        cy.url().should('include', '/homeApp.html'); // Ensure you are on the home page
      
        // Assuming you have stored the user's ID in localStorage after logging in
        cy.window().its('localStorage').invoke('getItem', 'userId').then((userId) => {

        cy.get('.post:nth-child(2) .numLikes').click();
      
        });
      });
      
        

})
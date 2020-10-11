describe("Test our form inputs", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/")
    })
    it("Add texts to input and submit form", () => {
        // fill out form
        cy.get("[data-cy=name]").type("William Jensen").should("have.value", "William Jensen");
        cy.get("[data-cy=email").type("william-jensen@lambdastudents.com").should("have.value", "william-jensen@lambdastudents.com");

        cy.get("[data-cy=password]").type("1TRpxs@VjWyz").should("have.value", "1TRpxs@VjWyz");
        cy.get("[type=checkbox]").check().should("be.checked");

        // submit the form
        cy.get("[data-cy=submit]").click();

        // checks that the submit effect shows on page (confirmation msg)
        cy.get("pre").should("exist");
    });
})
describe('C4 Modelizer - Navigation', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should navigate through all levels and back using breadcrumb and browser history', () => {
    cy.addNode()
    cy.editNodeProperty('name', 'Test System')
    cy.get('.react-flow__node').contains('Test System')
    cy.url().should('not.include', '/container')
    cy.url().should('not.include', '/component')
    cy.url().should('not.include', '/code')

    cy.get('.react-flow__node').first().dblclick()
    cy.url().should('include', '/container')
    cy.get('[data-testid="breadcrumb"]').should('contain', 'Test System')

    cy.addNode()
    cy.editNodeProperty('name', 'Test Container')
    cy.get('.react-flow__node').contains('Test Container')

    cy.get('.react-flow__node').first().dblclick()
    cy.url().should('include', '/component')
    cy.get('[data-testid="breadcrumb"]').should('contain', 'Test System')
    cy.get('[data-testid="breadcrumb"]').should('contain', 'Test Container')

    cy.addNode()
    cy.editNodeProperty('name', 'Test Component')
    cy.get('.react-flow__node').contains('Test Component')

    cy.get('.react-flow__node').first().dblclick()
    cy.url().should('include', '/code')
    cy.get('[data-testid="breadcrumb"]').should('contain', 'Test System')
    cy.get('[data-testid="breadcrumb"]').should('contain', 'Test Container')
    cy.get('[data-testid="breadcrumb"]').should('contain', 'Test Component')

    cy.addNode()
    cy.editNodeProperty('name', 'Test Code')
    cy.get('.react-flow__node').contains('Test Code')

    cy.get('[data-testid="breadcrumb"]').contains('systems').click()
    cy.url().should('not.include', '/container')
    cy.url().should('not.include', '/component')
    cy.url().should('not.include', '/code')
    cy.get('.react-flow__node').contains('Test System')

    cy.go('back')
    cy.url().should('include', '/code')
    cy.get('[data-testid="breadcrumb"]').should('contain', 'Test Component')
    cy.get('.react-flow__node').contains('Test Code')

    cy.go('back')
    cy.url().should('include', '/component')
    cy.url().should('not.include', '/code')
    cy.get('[data-testid="breadcrumb"]').should('contain', 'Test Container')
    cy.get('.react-flow__node').contains('Test Component')

    cy.go('back')
    cy.url().should('include', '/container')
    cy.url().should('not.include', '/component')
    cy.get('[data-testid="breadcrumb"]').should('contain', 'Test System')
    cy.get('.react-flow__node').contains('Test Container')

    cy.go('back')
    cy.url().should('not.include', '/container')
    cy.get('.react-flow__node').contains('Test System')
  })

  it('should navigate directly to specific levels using breadcrumb links', () => {
    cy.addNode()
    cy.editNodeProperty('name', 'Navigation System')
    cy.get('.react-flow__node').first().dblclick()

    cy.addNode()
    cy.editNodeProperty('name', 'Navigation Container')
    cy.get('.react-flow__node').first().dblclick()

    cy.addNode()
    cy.editNodeProperty('name', 'Navigation Component')
    cy.get('.react-flow__node').first().dblclick()

    cy.addNode()
    cy.editNodeProperty('name', 'Navigation Code')

    cy.url().should('include', '/code')

    cy.get('[data-testid="breadcrumb"]').contains('components').click()
    cy.url().should('include', '/container')
    cy.url().should('include', '/component')
    cy.url().should('not.include', '/code')
    cy.get('.react-flow__node').contains('Navigation Component')

    cy.get('[data-testid="breadcrumb"]').contains('containers').click()
    cy.url().should('include', '/container')
    cy.url().should('not.include', '/component')
    cy.url().should('not.include', '/code')
    cy.get('.react-flow__node').contains('Navigation Container')

    cy.get('[data-testid="breadcrumb"]').contains('systems').click()
    cy.url().should('not.include', '/container')
    cy.url().should('not.include', '/component')
    cy.url().should('not.include', '/code')
    cy.get('.react-flow__node').contains('Navigation System')
  })
})

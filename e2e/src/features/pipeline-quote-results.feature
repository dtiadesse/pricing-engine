Feature: View Pipeline page new tab, expanded quote details for each Opportunity
    As a MF pricing analyst
    I want to be able to have a basic pipeline with new tab,
    Each row should have a icon to expand/collapse to view quote details

    @MFPRICING-850
    Scenario: Accessing Quote Details Page for New tab
        Given I am logged into the Internal HUB as the "analyst"
        Then I access the pipeline table under the New tab
        Then Each Opportunity ID I am able to expand collapse a drawer
            | column       |
            | Quote        |
            | UPB          |
            | Quote Status |
            | LTV          |
            | DCR/MNR      |
            | Prepay       |
            | Product Type |
            | Priority     |
            | Submitted    |
            | Pool         |

    @MFPRICING-850
    Scenario: Accessing Quote Details Page for Extension tab
        Then  I access the pipeline table under the tab "Extension"
        Then Each Opportunity ID I am able to expand collapse a drawer
            | column         |
            | Quote          |
            | UPB            |
            | Quote Status   |
            | LTV            |
            | DCR/MNR        |
            | Prepay         |
            | Product Type   |
            | Priority       |
            | Submitted      |
            | Extension Type |
            | Pool           |

    @MFPRICING-850
    Scenario: Accessing Quote Details Page for Approval tab
        Then I access the pipeline table under the tab "Awaiting Approval"
        Then Each Opportunity ID I am able to expand collapse a drawer
            | column        |
            | Quote         |
            | UPB           |
            | Quote Status  |
            | LTV           |
            | DCR/MNR       |
            | Prepay        |
            | Product Type  |
            | Priority      |
            | Submitted     |
            | Approval Hold |
            | Pool          |

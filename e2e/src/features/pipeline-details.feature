Feature: View Pipeline Table on Landing Page
    As a MF pricing analyst
    I want to be able to have a basic pipeline view
    3 tabs New, Expansion, Awaiting Approval.
    Each tab will view all Quotes related to each category in Pricing Engine

    @MFPRICING-823
    Scenario: Pipeline results Page with Tab View
        Given I am logged into the Internal HUB as the "analyst"
        Then I access the existing landing home page and view the pipeline tabs
        Then I can see three new, separate tabs called "New", "Extension", "Awaiting Approval"

    @MFPRICING-823
    Scenario: Set-up New Tab
        Then I access the existing landing home page and view the pipeline tabs
        Then I access the pipeline table under the tab "New"
        Then I can see an updated table displaying all opportunities
            | column        |
            | Opportunity   |
            | Max UPB       |
            | Submitted     |
            | Property Name |
            | Borrower      |
            | Producer      |
            | Region        |
            | Claimed By    |
            |               |

    @MFPRICING-826
    Scenario: Set-up Extension Tab
        Given I am logged into the Internal HUB as the "analyst"
        Then I access the existing landing home page and view the pipeline tabs
        Then I access the pipeline table under the tab "Extension"
        Then I can see an updated table displaying all opportunities
            | column      |
            | Opportunity |
            | Max UPB     |
            | Submitted   |
            | Property    |
            | Borrower    |
            | Producer    |
            | Region      |
            | Claimed By  |
            |             |

    @MFPRICING-827
    Scenario: Set-up Awaiting Approval Tab
        Given I am logged into the Internal HUB as the "analyst"
        Then I access the existing landing home page and view the pipeline tabs
        Then I access the pipeline table under the tab "Awaiting Approval"
        Then I can see an updated table displaying all opportunities
            | column        |
            | Opportunity   |
            | Max UPB       |
            | Submitted     |
            | Property      |
            | Borrower      |
            | Producer      |
            | Region        |
            | Approval Hold |
            | Claimed By    |
            |               |

    @MFPRICING-825
    Scenario: Manually refresh the Pipeline results for all Tabs
        Given I am logged into the Internal HUB as the "analyst"
        Then I am a Pricing Analyst viewing the landing home page in Pricing Engine
        Then I select the Pipeline Refresh icon and I am able to see how recently the pipeline was refreshed with the language Refreshed with time changes

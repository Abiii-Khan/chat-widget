```mermaid
%% English version of “数据交互” diagram
flowchart TD
    A([User]) -->|Query Data| B[System Service]
    B -->|Submit| C[Backend]
    C -->|Invoke Interface| D[(Database/API)]
    D -->|Return Data| C
    C -->{Lookup Successful?}
    C -->|Yes| B
    C -->|No| E[Show Error Message]
    B -->|Display Data| A
    B -->|Check Data Status| F([Status Monitor])

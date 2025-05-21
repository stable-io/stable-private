## Test Cases

### Transfers:

v1 corridor:
- transfer with preapproval + native payment
- transfer with preapproval + usdc payment
- transfer with permit + native payment
- transfer with permit + usdc payment

avaHop:
- transfer with preapproval + native payment
- transfer with preapproval + usdc payment 
- transfer with permit + native payment
- transfer with permit + usdc payment

v2 corridor:
- transfer with preapproval + native payment
- transfer with preapproval + usdc payment
- transfer with permit + native payment
- transfer with permit + usdc payment

### Gas Drop Off:
- v1 - usdc
- v1 - native
- v2 - usdc
- v2 - native
- avax hop - usdc
- avax hop - native

- relayer limits gas drop-off (Requires special steps to test)
- sdk limits gas drop-off

### Max Relayer Fee:
- user max relayer fee is correctly passed to the transfer

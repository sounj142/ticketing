const TicketsError = {
  Tickets0001: '',
};

const _error: any = TicketsError;
for (const key in _error) {
  _error[key] = key;
}

export default TicketsError;

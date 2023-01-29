export const natsInfo = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (_subject: string, _data: string, callback: () => void) => {
          callback();
        }
      ),
  },
};

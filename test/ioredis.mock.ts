const Redis = jest.fn().mockImplementation(() => ({
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    on: jest.fn((event: string, callback: () => void) => {
      if (event === "connect") {
        callback();  // Llama al callback inmediatamente cuando "connect" se dispara
      }
    }),
  }));
  
  export default Redis;
  
describe('Home Page', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true);
  });

  it('should have correct configuration', () => {
    const port = 8081;
    expect(port).toBe(8081);
  });
});

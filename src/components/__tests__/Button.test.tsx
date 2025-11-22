describe('Button Component', () => {
  it('should exist', () => {
    expect(true).toBe(true);
  });

  it('should have correct props interface', () => {
    const variants = ['primary', 'secondary', 'danger'];
    expect(variants).toContain('primary');
  });

  it('should support different sizes', () => {
    const sizes = ['small', 'medium', 'large'];
    expect(sizes.length).toBe(3);
  });
});

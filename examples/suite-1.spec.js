describe('Test suite #1', () => {
  it('this is a passing test 1', (done) => setTimeout(done, 300));
  it('this is a passing test 2', (done) => setTimeout(done, 1000));
  describe('Test suite #1.5', () => {
    it('this is a passing test 3', (done) => setTimeout(done, 300));
    it('this is a passing test 4', (done) => setTimeout(done, 501));
    it('this fails', () => {
      expect(true).toBe(false)
    })
  })
  // it('this is a passing test 3', () => {});
  // it('fails once', () => {
    // expect(true).toBe(false)
  // });
  // it('fails twice', () => {
    // expect(true).toBe(false)
  // });
});


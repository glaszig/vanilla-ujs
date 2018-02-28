describe('Link methods', function () {
  var a, clickLink;

  beforeEach(function () {
    a = document.createElement('a');
    doc().body.appendChild(a);
    win().clickLink = clickLink = sinon.spy();
  });

  describe('no [data-method]', function () {
    beforeEach(function () {
      a.onclick = clickLink;
    });

    it('is sent normally', function () {
      click(a);

      expect(clickLink.called).to.be.true;
    });
  });

  describe('[data-method=get]', function () {
    beforeEach(function () {
      a.onclick = clickLink;
      a.setAttribute('data-method', 'get');
    });

    it('is sent normally', function () {
      click(a);

      expect(clickLink.called).to.be.true;
    });
  });

  describe('[data-method=post]', function () {
    beforeEach(function () {
      a.setAttribute('data-method', 'post');
    });

    describe('no [data-remote]', function () {
      beforeEach(function () {
        a.setAttribute('href', '/echo?callback=parse');
      });

      it('is sent as POST form', function (done) {
        var url = win().location.href;

        window.parse = function (json) {
          expect(url).to.not.equal(win().location.href);
          expect(json).to.deep.equal({
            method: 'post',
            path: '/echo'
          });
          done();
        };

        click(a);
      });

      it('is sent when clicking child element inside link', function (done) {
        var url = win().location.href;
        var i = document.createElement('i');
        a.appendChild(i);
        window.parse = function (json) {
          expect(url).to.not.equal(win().location.href);
          expect(json).to.deep.equal({
            method: 'post',
            path: '/echo'
          });
          done();
        };

        click(i);
      });
    });

    describe('[data-remote]', function () {
      beforeEach(function () {
        a.setAttribute('href', '/xhr');
        a.setAttribute('data-remote', 'true');
      });

      it('calls ajax:before event on a element with bubbling enabled', function (done) {
        var handler = function (event) {
          expect(event.target).to.equal(a);
          expect(event.bubbles).to.equal(true);

          doc().removeEventListener('ajax:before', handler);
          done();
        };

        doc().addEventListener('ajax:before', handler);

        click(a);
      });

      it('calls ajax:complete event on a element with bubbling enabled', function (done) {
        var handler = function (event) {
          expect(event.target).to.equal(a);
          expect(event.bubbles).to.equal(true);

          doc().removeEventListener('ajax:complete', handler);
          done();
        };

        doc().addEventListener('ajax:complete', handler);

        click(a);
      });

      it('is sent as XHR request', function (done) {
        var url = win().location.href;

        var handler = function (event) {
          expect(url).to.equal(win().location.href);
          expect(JSON.parse(event.detail.response)).to.deep.equal({
            method: 'post',
            path: '/xhr'
          });

          doc().removeEventListener('ajax:complete', handler);
          done();
        };

        doc().addEventListener('ajax:complete', handler);

        click(a);
      });
    });
  });

  describe('[data-method=delete]', function () {
    beforeEach(function () {
      a.setAttribute('href', '/echo?callback=parse');
      a.setAttribute('data-method', 'delete');
    });

    it('is sent with DELETE method', function (done) {
      window.parse = function (json) {
        expect(json).to.deep.equal({
          method: 'delete',
          path: '/echo'
        });
        done();
      };

      click(a);
    });
  });

  describe('[data-method=put]', function () {
    beforeEach(function () {
      a.setAttribute('href', '/echo?callback=parse');
      a.setAttribute('data-method', 'put');
    });

    it('is sent with PUT method', function (done) {
      window.parse = function (json) {
        expect(json).to.deep.equal({
          method: 'put',
          path: '/echo'
        });
        done();
      };

      click(a);
    });
  });
});

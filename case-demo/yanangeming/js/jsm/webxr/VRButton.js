class VRButton {

	static createButton( renderer, options ) {

		if ( options ) {

			console.error( 'THREE.VRButton: The "options" parameter has been removed. Please set the reference space type via renderer.xr.setReferenceSpaceType() instead.' );

		}

		const button = document.createElement( 'img' );

		function showEnterVR( /*device*/ ) {

			let currentSession = null;

			async function onSessionStarted( session ) {

				session.addEventListener( 'end', onSessionEnded );

				await renderer.xr.setSession( session );
				button.textContent = 'EXIT VR';

				currentSession = session;

			}

			function onSessionEnded( /*event*/ ) {

				currentSession.removeEventListener( 'end', onSessionEnded );

				button.textContent = 'ENTER VR';

				currentSession = null;

			}

			//
			
			button.src ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAE1UlEQVR4XuWbTWjlVBTHf+8V1BnbMiDaIqgLwYIifjFoi2CHYhWktVRQ6GZA0IWjoIK4qRXb7gRdiBYUBDeFERXbIn6h01LxY+EXg6UiLlSYhYMwvFZHhZknJySPTExyTnITX2wuPCjNved/zi839+PkpkH55ULgCuAS4CL/tx84HzjPl/8b+Av4A/jN//0K/AT8XqaLjZKMXwpcC1zpB+4iIyB+BI4DJ1wMxbUtEoDc0ZuAG4CLi3bUt3cS+Br40u8xzjJFANgH3ALcDFzg7JHNwJ/AF8DnwGlbk/haLgCk7fXA7YA8090oMmZ8CHwDtPM4kBfAAeAe4LI8oiW0+QV4EziV1XYeAJcD9wEyulepyGxxFPg5i1NZAdwI3AX0ZBH5D+ueAd4BvrJqWgE0gXF/sLPa7mY9GRw/AM5qTlgASPDS5Yc0YxW7/r3/SKRCsAC4839056P3QHrCe2k3RgMgz/xkxe5sVndW08aENAAy2h+u8IBnBSED42tJs0MSAJnnH6jgVGcNOlpPpshX4tYJcQDkf/dXaJGTN+hoO1ksvRpdMcYBkM3M3UWpVszOir+Z6rgVBSAbm0e6uLYvm5fsHV4Ib6CiAA4Bt5XtRZftbwDHAh/CAGQ//5i2pW232093OYBU+Uaj8Yzin2ylnw/yCWEAI/5yN7X9HgAg8cky+VP5IwzgiCWTs0cASGbpxTAAyeE9aOnaewSAhPqy5BiDHnAHMJwHgOGZs5jNXSd6QzL48xnwfgDgIWv21kEwd5BpDR38kWzzSwJAMjtPWL1zELRKZKrn6M+zAuBq4F6rqqOgVcZcz9Gf1wXAqP8ziWqCvb29zeXl5UOjo6PXicH19fVvZ2Zmju3u7qrZmbADVjuaP0pQ6wJAsrvyFsdUNMHV1dWxiYmJW8PG1tbWPpmcnPzIJOBXstrR/FE0jwsAmf5kGjQVTbDVaj3e19fXFza2s7Oz09/f/5xJwK9ktaP5o2h60+CjgOz/TUUTtDquiVntaP4oOqcEwJOA7AJNRRO0dl1NzGpH80fROS0AnsqS9tIErYPX/Pz8NePj41f19PQ0x8bG3m61WpK66hSrHc0fBcCZwgFod1auS/Czs7PTjUZDUu5sbW39MDw8fDQKwWKrCACFPgKa09Hgg/p5ITgC8B6BQgfBNABJwbtAcATgDYKFToNJALTg80JwBOBNg4UuhOIAxAXfbrfPLi0tvTs9PX1wcHBQzg91SpbHwRGAtxAqdCkcBZAU/OLi4ltzc3PfDQ0N7d/Y2Dg8MDCQC4IjAG8pXNpmSAs+gOUCwRGAtxkqZTs8MjJyYHNz8+Fms9k5SyDdPrjz0Z6SBGFlZWVzamrq46SxxRGAtx2Wkjshok17wfW04LWeYNWQehkyQp2EiLTLnRKzOrewsPCGPPNa/aSeoLULrmcAcE5KrPSkaAbHEAjb29vmLFUYTgadc5KiYqPUtHgGx7x48mafjTr/SouLpunFiLUrVrxe7IsR06uxigdmcS/x1Zg0rvXLUQFQ+9fjAqHWByS8tUTdj8gIhFofkgpG0lofkwsg1PqgZACh1kdlBULtD0sHEGp7XD68vKztBxNhCLX+ZCYAUeuPpjrJlzp/Nhd+JGr74WR0713bT2fjkhC1/Hg6KRtT6c/n/wFuR3GDM09m+gAAAABJRU5ErkJggg=="

			button.style.display = '';

			button.style.cursor = 'pointer';
			// button.style.left = 'calc(50% - 50px)';
			button.style.width = '32px';
			button.style.height = "32px";

			button.textContent = 'ENTER VR';

			button.onmouseenter = function () {

				// button.style.opacity = '1.0';

			};

			button.onmouseleave = function () {

				// button.style.opacity = '0.5';

			};

			button.onclick = function () {

				if ( currentSession === null ) {

					// WebXR's requestReferenceSpace only works if the corresponding feature
					// was requested at session creation time. For simplicity, just ask for
					// the interesting ones as optional features, but be aware that the
					// requestReferenceSpace call will fail if it turns out to be unavailable.
					// ('local' is always available for immersive sessions and doesn't need to
					// be requested separately.)

					const sessionInit = { optionalFeatures: [ 'local-floor', 'bounded-floor', 'hand-tracking', 'layers' ] };
					navigator.xr.requestSession( 'immersive-vr', sessionInit ).then( onSessionStarted );

				} else {

					currentSession.end();

				}

			};

		}

		function disableButton() {

			button.style.display = '';

			button.style.cursor = 'auto';
			// button.style.left = 'calc(50% - 75px)';
			button.style.width = '150px';

			button.onmouseenter = null;
			button.onmouseleave = null;

			button.onclick = null;

		}

		function showWebXRNotFound() {

			disableButton();

			button.textContent = 'VR NOT SUPPORTED';

		}

		function showVRNotAllowed( exception ) {

			disableButton();

			console.warn( 'Exception when trying to call xr.isSessionSupported', exception );

			button.textContent = 'VR NOT ALLOWED';

		}

		function stylizeElement( element ) {

			element.style.position = 'absolute';
			element.style.top = '20px';
			element.style.right = '20px';
			// element.style.padding = '12px 6px';
			// element.style.border = '1px solid #fff';
			element.style.borderRadius = '4px';
			// element.style.background = 'rgba(0,0,0,0.1)';
			element.style.color = '#fff';
			element.style.font = 'normal 13px sans-serif';
			element.style.textAlign = 'center';
			element.style.opacity = '0.5';
			element.style.outline = 'none';
			element.style.zIndex = '999';

		}

		if ( 'xr' in navigator ) {

			button.id = 'VRButton';
			button.style.display = 'none';

			stylizeElement( button );

			navigator.xr.isSessionSupported( 'immersive-vr' ).then( function ( supported ) {

				supported ? showEnterVR() : showWebXRNotFound();

				if ( supported && VRButton.xrSessionIsGranted ) {

					button.click();

				}

			} ).catch( showVRNotAllowed );

			return button;

		} else {

			const message = document.createElement( 'a' );

			if ( window.isSecureContext === false ) {

				message.href = document.location.href.replace( /^http:/, 'https:' );
				message.innerHTML = 'WEBXR NEEDS HTTPS'; // TODO Improve message

			} else {

				message.href = 'https://immersiveweb.dev/';
				message.innerHTML = 'WEBXR NOT AVAILABLE';

			}

			message.style.left = 'calc(50% - 90px)';
			message.style.width = '180px';
			message.style.textDecoration = 'none';

			stylizeElement( message );

			return message;

		}

	}

	static xrSessionIsGranted = false;

	static registerSessionGrantedListener() {

		if ( 'xr' in navigator ) {

			// WebXRViewer (based on Firefox) has a bug where addEventListener
			// throws a silent exception and aborts execution entirely.
			if ( /WebXRViewer\//i.test( navigator.userAgent ) ) return;

			navigator.xr.addEventListener( 'sessiongranted', () => {

				VRButton.xrSessionIsGranted = true;

			} );

		}

	}

}

VRButton.registerSessionGrantedListener();

export { VRButton };

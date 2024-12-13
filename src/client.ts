// const threeDSMethodData = Buffer.from(
//     JSON.stringify({
//       threeDSMethodNotificationURL: 'https://your-notification-url.com',
//       threeDSServerTransID: check3DSResponse.data.ThreeDSServerTransID,
//     })
//   ).toString('base64');

//   const iframeHTML = `
//     <body onload="document.form.submit()">
//       <form name="form" action="${check3DSResponse.data.ThreeDSMethodURL}" method="post">
//         <input type="hidden" name="threeDSMethodData" value="${threeDSMethodData}">
//       </form>
//     </body>`;

//   console.log('3DS Method iframe HTML:', iframeHTML);
// }


// import React, { useEffect } from "react";

// const ThreeDSMethodIframe = ({ threeDSMethodData, threeDSMethodURL }: { threeDSMethodData: string; threeDSMethodURL: string }) => {
//   useEffect(() => {
//     // Automatically submit the form when the component is mounted
//     const form = document.getElementById("threeDSMethodForm") as HTMLFormElement;
//     if (form) {
//       form.submit();
//     }
//   }, []);

//   return (
//     <div>
//       <iframe
//         title="3DS Method"
//         style={{ width: "100%", height: "100%", border: "none" }}
//         sandbox="allow-same-origin allow-scripts"
//       >
//         <html>
//           <body>
//             <form id="threeDSMethodForm" method="POST" action={threeDSMethodURL}>
//               <input type="hidden" name="threeDSMethodData" value={threeDSMethodData} />
//             </form>
//           </body>
//         </html>
//       </iframe>
//     </div>
//   );
// };

// export default ThreeDSMethodIframe;

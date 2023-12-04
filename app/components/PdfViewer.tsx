// import React from "react";
import { Worker } from "@react-pdf-viewer/core";
// import { Viewer } from "@react-pdf-viewer/core";
// import { fullScreenPlugin } from "@react-pdf-viewer/full-screen";
// import "@react-pdf-viewer/full-screen/lib/styles/index.css";
// import "@react-pdf-viewer/core/lib/styles/index.css";

// const PdfViewer = () => {
//   // const fullScreenPluginInstance = fullScreenPlugin(props?: FullScreenPluginProps);
//   return (
//     <div className="h-[1050px] mb-10">
//       <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
//         <Viewer fileUrl="https://www.africau.edu/images/default/sample.pdf" />
//       </Worker>
//     </div>
//   );
// };

// export default PdfViewer;

import * as React from "react";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Box, Flex } from "@radix-ui/themes";

interface DefaultLayoutExampleProps {
  fileUrl: string;
}

const DefaultLayoutExample: React.FC<DefaultLayoutExampleProps> = ({
  fileUrl,
}) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="h-[1000px] rounded-lg border overflow-hidden">
      <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js">
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance]}
          theme={{
            theme: "dark",
          }}
        />
      </Worker>
    </div>
  );
};

export default DefaultLayoutExample;

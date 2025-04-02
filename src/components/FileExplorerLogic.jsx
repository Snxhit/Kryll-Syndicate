import { useState, useEffect } from 'preact/hooks';
//import Navbar from '../components/navigation.astro';
// Make sure that the navbar is present on this page.

export default function FileExplorerLogic() {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const files = [];
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i) != "astroErrorOverlayTheme")
      {
        files.push(localStorage.key(i));
      }
    }
    setFileList(files);
  }, []);

  return (
    <>
      <ol>
        {fileList.map((file, index) => (
          <li key={index}>
            <a href={`/CodeEditor?file=${encodeURIComponent(file)}`}>{file}</a>
          </li>
        ))}
      </ol>
    </>
  );
}

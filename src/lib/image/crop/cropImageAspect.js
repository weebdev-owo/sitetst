// /* eslint-disable @next/next/no-img-element */
// import { useState, useRef, useEffect, memo } from 'react'
// import ReactCrop, {centerCrop,makeAspectCrop,Crop,PixelCrop,} from 'react-image-crop'
// import { canvasPreview } from '/src/lib/crop/canvasPreview'
// import { imagePreview } from '/src/lib/crop/imagePreview'
// import { useDebounce } from '/src/lib/crop/useDebounce'


// import 'react-image-crop/dist/ReactCrop.css'

// // This is to demonstate how to make and center a % aspect crop
// // which is a bit trickier so we use some helper functions.
// function centerAspectCrop(mediaWidth , mediaHeight, aspect) {
//     const aspectCrop = makeAspectCrop({unit: '%',width: 90}, aspect, mediaWidth, mediaHeight)
//     return centerCrop(aspectCrop, mediaWidth, mediaHeight)
// }

// function CropImage({file}) {
//   const [imgSrc, setImgSrc] = useState('')
//   const previewCanvasRef = useRef(null)
//   const imgRef = useRef(null)
//   const [crop, setCrop] = useState(null)
//   const [completedCrop, setCompletedCrop] = useState(null)
//   const [aspect, setAspect] = useState(16 / 9)
//   const [newImgSrc, setNewImgSrc] = useState('')

// //   function onSelectFile(e) {
// //     if (e.target.files && e.target.files.length > 0) {
// //       setCrop(undefined) // Makes crop preview update between images.
// //       const reader = new FileReader()
// //       reader.addEventListener('load', () =>
// //         setImgSrc(reader.result.toString() || ''),
// //       )
// //       reader.readAsDataURL(e.target.files[0])
// //     }
// //   }
//     useEffect(() =>{
//         setCrop(undefined)
//         const reader = new FileReader()
//         reader.onloadend = () => {setImgSrc(reader.result.toString() || '')}
//         reader.readAsDataURL(file)
//     }, [file])

//     // function onImageLoad(e) {
//     //     if (aspect) {
//     //         const { width, height } = e.currentTarget
//     //         setCrop(centerAspectCrop(width, height, aspect))
//     //     }
//     // }

//     const renderPreview = async () =>{
//         if (completedCrop?.width && completedCrop?.height && imgRef.current) {
//         // if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
//             // We use canvasPreview as it's much faster than imgPreview.
//             // canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate)
//             const compsrc= await imagePreview(imgRef.current, completedCrop)
//             setNewImgSrc(compsrc)
//         }
//     }

//     const throttle_interval = 100

//     useDebounce(renderPreview, throttle_interval, [completedCrop, file])

//     // function handleToggleAspectClick() {
//     //     if (aspect) {
//     //         setAspect(undefined)
//     //     } 
//     //     else if (imgRef.current) {
//     //         const { width, height } = imgRef.current
//     //         setAspect(16 / 9)
//     //         setCrop(centerAspectCrop(width, height, 16 / 9))
//     //     }
//     // }

//   return (
//     <div className="App">   
//         {/* <div className="Crop-Controls">

//         <div>
//             <button onClick={handleToggleAspectClick}>
//             Toggle aspect {aspect ? 'off' : 'on'}
//             </button>
//         </div>
//         </div> */}
//         {imgSrc ? 
//             <ReactCrop 
//                 crop={crop} 
//                 onChange={(_, percentCrop) => setCrop(percentCrop)} 
//                 onComplete={(c) => setCompletedCrop(c)} 
//                 aspect={aspect}
//             >
//                 <img ref={imgRef} alt="Crop me" src={imgSrc} />
//             </ReactCrop>:null
//         }
//         {newImgSrc ? <img src={newImgSrc} alt={'reee'} />: null}
//       {/* <div>
//         {(completedCrop) ? (
//           <canvas
//             ref={previewCanvasRef}
//             style={{
//               border: '1px solid black',
//               objectFit: 'contain',
//               width: completedCrop.width,
//               height: completedCrop.height,
//             }}
//           />
//         )}
//       </div> */}
//     </div>
//   )
// }


// CropImage = memo(CropImage)
// export default CropImage
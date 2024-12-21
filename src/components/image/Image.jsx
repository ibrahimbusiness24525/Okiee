export default function Image({ fallback,className, onFailedToLoad, ...props }) {
  return (
    <img
   style={{
    width:'260px',
    height:'250px',
    borderRadius:'45px'
   }}
      {...props}
      alt={props.alt}
    />
  );
}

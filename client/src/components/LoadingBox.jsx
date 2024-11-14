
import { ClipLoader} from 'react-spinners';

export default function LoadingBox({size,color,text , block}) {
  return (
        <div className={`${"loadingBox"}   ${ block && "dim" } `}>
                <ClipLoader color={color}   size={size}  /> 
                {
                        text==="" ?
                        <span hidden>{text}</span>
                        :
                        <span>{text}</span>
                }
        </div>
  );
}


LoadingBox.defaultProps={
        size:10,
       color: "grey",
       text:"Loading..."
}
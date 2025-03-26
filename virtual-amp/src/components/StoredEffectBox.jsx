export default function EffectBox({name,color,onClick}){
    return(
        <div onClick={onClick}
        className="h-1/1"style={{backgroundColor:color}}>{name}</div>
    )
}
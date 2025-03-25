export default function EffectBox({name,colour,onClick}){
    return(
        <div onClick={onClick}
        className="h-1/1"style={{backgroundColor:colour}}>{name}</div>
    )
}
export default function EffectBox({name,colour}){
    return(
        <div className="h-1/1 rounded-md"style={{backgroundColor:colour}}>{name}</div>
    )
}
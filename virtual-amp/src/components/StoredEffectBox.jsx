export default function EffectBox({name,color,onClick}){
    return(
        <div onClick={onClick}
        className="mb-2 h-20 font-semibold text-lg rounded-md border-2 border-gray-500 "style={{backgroundColor:color}}>{name}</div>
    )
}
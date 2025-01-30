import { useEffect, useState } from "react"
import CommentItem from "./CommentItem"

export default function CommentSection({comments}){

    return(
        <div>
          {/* TODO: comment beíró mező */}
            <CommentItem comment={{
        user:{
            name: "Teszt",
            avatar: "https://erdosprogram.hu/wp-content/uploads/2024/04/hegyhati.jpg"
        },
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla rhoncus turpis nisl, id semper sapien finibus sit amet. Mauris vehicula neque at mauris lacinia lobortis. Donec ornare enim eget ex rhoncus, quis ullamcorper libero vulputate. Etiam eu lacus sit amet est pellentesque porttitor. Quisque a augue nisl. In eget venenatis nibh. Donec neque urna, pulvinar ut mattis in, venenatis sed sem. Morbi imperdiet ligula felis. Quisque dignissim nulla non fermentum ultricies. Curabitur commodo consequat leo sed rhoncus. Etiam ut ornare lacus. Aenean fringilla, augue id luctus hendrerit, nibh lorem porttitor enim, nec ultricies diam est eu urna. Quisque nisl tortor, porttitor id aliquam in, sollicitudin maximus enim. Nunc eget turpis non justo congue accumsan. Vestibulum in nisi quis magna sollicitudin.",
        created:"2025-01-01"

    }} />
    <CommentItem comment={{
        user:{
            name: "Gammapolis",
            avatar: "https://gammapolis.hu/images/szekekulo.jpg"
        },
        content: "Jó lett 🤘",
        created:"2025-01-02"

    }} />

    <CommentItem comment={{
        user:{
            name: "Kovács Béláné",
            avatar: "https://cms.static.marquardmedia.hu/data/cikk/258/258436-idos-neni-tanacs.1200x630.jpg"
        },
        content: "Hinnye",
        created:"2025-01-03"

    }} />
            {/* {comments.map(comment => <CommentItem/>) } */}
        </div>
    )
}
import React from 'react'
import './Feature.css';

function Feature () {
    return (
        <div className="row m-2 col">
            <div className="features col">
                <p className="text">“Students at the University of Greenwich will not only focus on the key theoretical and practical aspects of their studies but they will also develop a range of those general skills that are essential in any career.
                </p>
                <p className="text">
                The ability to communicate well, to think critically, to work in a team and to solve problems are all characteristics of Greenwich students. These skills are increasingly in demand from employers. “
                </p>
                <p className="author">
                Professor Jane Harrington, Vice - Chancellor of the University of Greenwich, UK
                </p>
            </div>
            <div className="image col">
                <img src="https://media.discordapp.net/attachments/984158010731548722/1213913753238896650/image.png?ex=65f73448&is=65e4bf48&hm=151c3b4ae868550a49848fc0d31fce2a549574746ad3de2692b23d094df6f52c&=&format=webp&quality=lossless&width=263&height=350" alt=""
                />
                <img src="https://media.discordapp.net/attachments/984158010731548722/1213911514910564372/image.png?ex=65f73232&is=65e4bd32&hm=d68d8637419d525494f791d708f7ab7fe3076c62e209f977fff50d9f04cd274a&=&format=webp&quality=lossless&width=263&height=350" />
                <img src="https://media.discordapp.net/attachments/984158010731548722/1211063331268468836/Screenshot_2024-02-25-04-32-56-78_572064f74bd5f9fa804b05334aa4f912.jpg?ex=65f6101e&is=65e39b1e&hm=95f228144776186abe92a22b41eb0666eb86777dbb14e55ad5d73fbc3daf0727&=&format=webp&width=157&height=350" />
                <img src="https://media.discordapp.net/attachments/984158010731548722/1211050687702769705/Screenshot_2024-02-25-03-42-29-44_572064f74bd5f9fa804b05334aa4f912.jpg?ex=65f60458&is=65e38f58&hm=ddcc8a5ae22d4e3863a4c79217ea4ff6eb177ab7ff4e13101cde4887c2a3116c&=&format=webp&width=300&height=670" />
            </div>
        </div>
    )
}
export default Feature;
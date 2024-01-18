import '../App.css'
import {  useState } from "react";
import cart from "../img/cart.png";
const LiveSearch = () => {
	const [user, setUser] = useState({
		write:"",
		result:[]
	});
	
	const [selectedDrink, setSelectedDrink] = useState(null);
	const [cartItem, setCartItem] = useState([]);
	const [sum , setSum] = useState(0);
	const [isCartOpen, setIsCartOpen] = useState(false);
	const handleInputChange  = async (event) => {
		const { name, value } = event.target;

		setUser((prevState) => ({
			...prevState,
			[name]: value,
			

		}));
		if(value===""){
			setUser({
				write: "",
				result: [],
			});
			return <div></div>
		}
		const wordfetch = await fetch (`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${value}`)
		const data = await wordfetch.json()
		setUser({ 
			result:data.drinks
	})
		
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		
	};
	const showInstruction = (drink) => {
		
		if (selectedDrink === drink) {
			setSelectedDrink(null);
		} else {
		setSelectedDrink(drink);
		}
	};
	const addToCart = (drink) => {
		const newCartItem = { ...drink, id: Date.now() }; 
		setCartItem((prevCart) => [...prevCart, newCartItem]);
		setSum((prevSum) => prevSum + 1);
	};
	
    
		const ShowCart = () => {
			setIsCartOpen(!isCartOpen);
		}

		const handleDelete = (drinkToDelete) => {
			setCartItem((prevCart) => prevCart.filter((item) => item.id !== drinkToDelete.id));
			setSum((prevSum) => prevSum - 1);
		};
		
		
		
	return (
		<>
	<header>
		<h3>Search Cocktails</h3>
	<div  onClick={ShowCart} className='cart'>
		<span className='cartspan'>Cart</span>
		<img src={cart} alt="" />
	</div>
	<div className='sum'>
		{sum}
	</div>
	</header>
	{isCartOpen && (
			<div className='cart-dropdown'>
        {cartItem.map((item) => {
			const {strDrink, strDrinkThumb}=item
			return (
				<div key={item.id} className="dropcontent">
					<img src={strDrinkThumb} alt="BackEndError" className='dropimgs' />
					<small>{strDrink}</small>
					<button onClick={() => handleDelete(item)}>Delete</button>
				</div>
			)
			})}
        </div>
		)
	}
		<div>
		<form onSubmit={handleSubmit}>
			<input
				placeholder="Go  search"
				name="first_name"
				onChange={handleInputChange}
			/>
			
			
		</form>
		{
			user.write ==="" ? <div></div> : user.result === null ? <div className='notfound'> Not Found</div>:
			user.result?.map(ele =>{
				const {strDrink,strDrinkThumb,strCategory,strInstructions}=ele
				return (
					<section  key={strDrink}>
						<div className='maindiv'>
							<div>
            <ul><li>Name : {strDrink}</li></ul> 
			
            <h2>{"Drink Category:"+" "+strCategory}</h2>
			 </div>
            <img className='images' src={strDrinkThumb} alt="image"/>
			</div>
			<div className='gap'>

			
			<div className='instructionbutton'>
			<button  className='seeinstructions' onClick={() => showInstruction(strDrink)}>See Instruction</button>
			</div>
			<div className='instructionsdiv'>
            {selectedDrink === strDrink && <p className='instructions'>{strInstructions}</p>}
			</div>
			<div className='cartbuttons'>
			<button onClick={() => addToCart(strDrink)} className='addtocart'>Add to cart</button>
			</div>
			</div>
            </section>
            )
		} )
	}
		</div>
		</>
	);
};

export default LiveSearch
import { environment } from '../../environment';
import { PUSH_IMAGE,RESET_IMAGE } from './face.type'

const default_image = {image: environment.default_avatar_image, isFake : true};
// 9 elements
const default_images = [{...default_image},{...default_image},{...default_image},{...default_image},{...default_image},{...default_image},{...default_image},{...default_image},{...default_image}]
const initialState = {
    images: [...default_images],
    pointer: 0,
};

const reducer = (state = {...initialState}, action) => {
  let group = [[0,1,2],[3,4,5],[6,7,8]];
  // let group2 = [3,4,5];
  // let group3 = [6,7,8];
    switch (action.type) {
      case PUSH_IMAGE:
        if(state.images[action.payload2].isFake) {
          state.images = [...state.images]



          // if ((action.payload2 === 1 && state.images[1].isFake) || (action.payload2 === 4 && state.images[4].isFake) || (action.payload2 === 7 && state.images[7].isFake)) {
          //   // dispatch(pushImage(imageSrc, i + 1, true));
          //   if(state.images[action.payload2 + 1].isFake)
          //     state.images[action.payload2 + 1].image = action.payload;
          //   // dispatch(pushImage(imageSrc, i - 1, true));
          //   if(state.images[action.payload2 - 1].isFake)
          //     state.images[action.payload2 - 1].image = action.payload;
          // }
          let _group = [];
          group.forEach(gr => {
            gr.forEach(number => {
              if(number === action.payload2)
                _group = gr;
            })
          });
          _group.forEach(position => {
            if(state.images[position].isFake && state.images[position].image === environment.default_avatar_image)
              state.images[position].image = action.payload;
          })
          state.images[action.payload2].image = action.payload
          state.images[action.payload2].isFake = action.payload3
        }
          return {
            ...state,
          };
      case RESET_IMAGE:
        return {
          images: [...[{...default_image},{...default_image},{...default_image},{...default_image},{...default_image},{...default_image},{...default_image},{...default_image},{...default_image}]],
          pointer: 0,
        }
      default:
        return state;
    }
  };
  
  export default reducer;
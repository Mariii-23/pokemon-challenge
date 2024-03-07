import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { POKEMON_SERVICE } from './service';
import userEvent from '@testing-library/user-event';
import { IPokemon } from './pokemon';

jest.mock('./service', () => ({
  POKEMON_SERVICE: {
    getAllNames: jest.fn(),
    searchPokemon: jest.fn(),
  },
}));

const mockSearchPokemon = POKEMON_SERVICE.searchPokemon as jest.Mock;
const mockGetAllNames = POKEMON_SERVICE.getAllNames as jest.Mock;

describe('App component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockGetAllNames.mockReturnValue(["ditto","meditite", "salandit", "charmander", "charizard", "metapod"])
    mockSearchPokemon.mockResolvedValue({
      id: 132,
      name: 'ditto',
      weight: 300,
      speciesName: 'other specie',
      url_front: "",
      url_back: "",
      stats: [],
      types: [],
    } as IPokemon);
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  test('Searches for a Pokemon', async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/Enter Pokémon Name/);
    const button = screen.getByText(/Find/);

    await act(() => {
      userEvent.type(input, 'ditto');
      userEvent.click(button);
    })

    expect(mockSearchPokemon).toHaveBeenCalledWith('ditto');
    expect(screen.getByText("ditto")).toBeInTheDocument();
    expect(screen.getByText("other specie")).toBeInTheDocument();
  });

  //FIXME: Dont work as expect
  // test('Text-based search feature', async () => {
  //   render(<App />)

  //   const input = screen.getByPlaceholderText(/Enter Pokémon Name/);

  //   await act(() => {
  //     userEvent.type(input, 'dit');
  //   })

  //   await waitFor(() => {
  //     expect(screen.getByText("ditto")).toBeInTheDocument();
  //   })
  //   await waitFor(() => {
  //     expect(screen.getByText("meditite")).toBeInTheDocument();
  //   })
  //   await waitFor(() => {
  //     expect(screen.getByText("salandit")).toBeInTheDocument();
  //   })
  // });

  test('Switches to the next Pokemon', async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/Enter Pokémon Name/);
    const buttonFind = screen.getByText(/Find/);

    await act(() => {
      userEvent.type(input, 'ditto');
      userEvent.click(buttonFind);
    })

    const button =screen.getByText(/Next/);
    expect(button).toBeInTheDocument();

    await act(() => {
      userEvent.click(button);
    })

    expect(mockSearchPokemon).toHaveBeenCalledWith("133");
  });

  test('Switches to the previous Pokemon', async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/Enter Pokémon Name/);
    const buttonFind = screen.getByText(/Find/);

    await act(() => {
      userEvent.type(input, 'ditto');
      userEvent.click(buttonFind);
    })

    const button =screen.getByText(/Back/);
    expect(button).toBeInTheDocument();

    await act(() => {
      userEvent.click(button);
    })

    expect(mockSearchPokemon).toHaveBeenCalledWith("131");
  });
});
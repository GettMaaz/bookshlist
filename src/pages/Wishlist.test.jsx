import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { Wishlist } from "./Wishlist"

describe("Wishlist component", () => {
    beforeEach(() => {
        // Default fetch stub, so no test ever reaches the real network or backend.
        // Tests that need specific data override it with their own global.fetch.
        vi.stubGlobal("fetch", vi.fn((url) => {
            if (url.includes("localhost:3000")) {
                return Promise.resolve({ json: () => Promise.resolve([]) })
            }
            return Promise.resolve({ json: () => Promise.resolve({ docs: [] }) })
        }))
    })
    afterEach(() => {
        vi.unstubAllGlobals()
    })
    it("display the search input field", () => {
        render(<Wishlist />)
        const input = screen.getByRole("textbox")
        expect(input).toBeInTheDocument()
    })
    it("updates the value as type", () => {
        render(<Wishlist />)
        const input = screen.getByRole("textbox")
        fireEvent.change(input, {target: { value: "harry"}})
        expect(input.value).toBe("harry")
    })
    it("testing API", async () => {
        // eslint-disable-next-line no-undef
        global.fetch = vi.fn((url) => {
            if (url.includes("localhost:3000")) {
                return Promise.resolve({ json: () => Promise.resolve([]) })
            }
            return Promise.resolve({
                json: () => Promise.resolve({ docs: [{ key: "/works/0L1W", title: "Harry Potter", author_name: ["J.K. Rowling"] }] })
            })
        })
        render(<Wishlist />)
        const input = screen.getByRole("textbox")
        fireEvent.change(input, { target: { value: "harry" } })
        const bookTitle = await screen.findByText(/Harry Potter/i)
        expect(bookTitle).toBeInTheDocument()
    })
    it("testing create wishlist", async () => {
        // eslint-disable-next-line no-undef
        global.fetch = vi.fn((url) => {
            if (url.includes("localhost:3000")) {
                return Promise.resolve({ json: () => Promise.resolve([]) })
            }
            return Promise.resolve({
                json: () => Promise.resolve({ docs: [{ key: "/works/01LW", title: "Harry Potter", author_name: ["J.K. Rowling"] }] })
            })
        })
        render(<Wishlist />)
        const input = screen.getByRole("textbox")
        fireEvent.change(input, { target: { value: "harry" } })
        const book = await screen.findByText(/Harry Potter/i)
        fireEvent.click(book)
        const createList = screen.getByText("Create list");
        fireEvent.click(createList)
        const inputs = screen.getAllByRole("textbox");
        fireEvent.change(inputs[1], { target: { value: "fantasy" } })
        const create = screen.getByText("Create")
        fireEvent.click(create);
        const listName = await screen.findByText(/fantasy/);
        expect(listName).toBeInTheDocument()
    })
    it("testing delete book from wishlist", async () => {
        // eslint-disable-next-line no-undef
        global.fetch = vi.fn((url) => {
            if (url.includes("localhost:3000")) {
                return Promise.resolve({ json: () => Promise.resolve([]) })
            }
            return Promise.resolve({
                json: () => Promise.resolve({ docs: [{ key: "/works/01LW", title: "Harry Potter", author_name: ["J.K. Rowling"] }] })
            })
        })
        render(<Wishlist />);
        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "harry" } });
        const book = await screen.findByText(/Harry Potter/i);
        fireEvent.click(book)
        const createList = screen.getByText("Create list");
        fireEvent.click(createList);
        const inputs = screen.getAllByRole("textbox");
        fireEvent.change(inputs[1], { target: { value: "fantasy" } });
        const create = screen.getByText("Create");
        fireEvent.click(create)
        const listName = await screen.findByText(/fantasy/);
        fireEvent.click(listName)
        const cross = screen.getAllByText("×");
        fireEvent.click(cross[1])
        await waitFor(() => {
            expect(screen.queryByText("Harry Potter")).not.toBeInTheDocument()
        })
    })
    it("testing fail API", async () => {
        // eslint-disable-next-line no-undef
        global.fetch = vi.fn(() => 
            Promise.reject(new Error("network error"))
        )
        render(<Wishlist />);
        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "harry" } });
        const error = await screen.findByText("The books cloud not be loaded, please check your connection.");
        expect(error).toBeInTheDocument();
    })
})
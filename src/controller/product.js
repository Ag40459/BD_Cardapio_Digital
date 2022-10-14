const knex = require("../../connection");

const registerProduct = async (req, res) => {
    const { titulo_produto, id_categoria, preco, descricao } = req.body

    if (!titulo_produto || !id_categoria || !preco || !descricao) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }
    try {
        const checkCategory = await knex('categorias').where({ id: id_categoria }).first();
        if (!checkCategory) {
            return res.status(400).json({ message: 'A categoria informada não existe.' });
        }
        const product = await knex('produtos').insert({
            titulo_produto,
            categoria: id_categoria,
            preco,
            descricao,
        }).returning('*');

        return res.status(201).json(product[0]);

    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const listProduct = async (req, res) => {

    try {
        const product = await knex('produtos');
        return res.json(product)
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const updateProduct = async (req, res) => {
    const { id, titulo_produto, id_categoria, preco, descricao } = req.body

    if (!titulo_produto || !id_categoria || !preco || !descricao) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }
    const checkIdProduct = await knex('produtos').where({ id }).first();
    if (!checkIdProduct) {
        return res.status(400).json({ message: 'Esse produto não existe.' });
    }
    try {
        const updateProduct = await knex('produtos').where({ id }).update({
            titulo_produto,
            categoria: id_categoria,
            preco,
            descricao,
        }).returning('*');
        if (!updateProduct[0]) {
            return res.status(400).json({ message: "O produto não foi atualizado" })
        }
        return res.status(200).json(updateProduct[0]);

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await knex('produtos').where({ id }).first();

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        const deleteProduct = await knex('produtos').where({ id }).del();

        if (!deleteProduct) {
            return res.status(400).json({ message: "O produto não foi excluido" });
        }

        return res.status(200).json({ message: 'Produto excluido com sucesso' });
    } catch (error) {
        return res.status(400).json(error.message);
    }
}
module.exports = {
    registerProduct, listProduct, updateProduct, deleteProduct
}